import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { Member } from "@shared/schema";
import { calculateMonthlyPayment } from "@/lib/utils";
import { useState, useEffect } from "react";

const loanSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  amount: z.number().min(1000000, "Loan amount must be at least Rp 1,000,000"),
  term: z.number().min(1, "Term must be at least 1 month").max(60, "Term cannot exceed 60 months"),
  interestRate: z.number().min(0, "Interest rate cannot be negative").max(25, "Interest rate cannot exceed 25%"),
  purpose: z.string().min(5, "Loan purpose is required"),
});

interface ProcessLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessLoanDialog({ open, onOpenChange }: ProcessLoanDialogProps) {
  const { toast } = useToast();
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  
  const { data: members, isLoading: isLoadingMembers } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    enabled: open,
  });
  
  const form = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      memberId: "",
      amount: 5000000,
      term: 12,
      interestRate: 5.5,
      purpose: "",
    },
  });
  
  // Watch for changes in form fields to calculate monthly payment
  const amount = form.watch("amount");
  const term = form.watch("term");
  const interestRate = form.watch("interestRate");
  
  useEffect(() => {
    if (amount > 0 && term > 0 && interestRate >= 0) {
      const payment = calculateMonthlyPayment(amount, interestRate, term);
      setMonthlyPayment(payment);
    }
  }, [amount, term, interestRate]);
  
  const createLoan = useMutation({
    mutationFn: async (values: z.infer<typeof loanSchema>) => {
      const res = await apiRequest("POST", "/api/loans", {
        memberId: parseInt(values.memberId),
        amount: values.amount,
        interestRate: values.interestRate,
        term: values.term,
        purpose: values.purpose,
        applicationDate: new Date(),
        status: "pending",
        totalRepaid: 0,
        monthlyPayment: monthlyPayment,
      });
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Loan application submitted",
        description: "The loan application has been submitted for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit loan application",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: z.infer<typeof loanSchema>) {
    createLoan.mutate(values);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>New Loan Application</DialogTitle>
          <DialogDescription>
            Create a new loan application for a cooperative member
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingMembers ? (
                        <SelectItem value="loading" disabled>
                          Loading members...
                        </SelectItem>
                      ) : (
                        members?.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.employeeId} - {`Member #${member.id}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (months): {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={60}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%): {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={15}
                        step={0.5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the purpose of this loan" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {monthlyPayment > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium mb-2">Loan Summary</h4>
                <p className="text-sm mb-1">Principal: Rp {amount.toLocaleString()}</p>
                <p className="text-sm mb-1">Term: {term} months</p>
                <p className="text-sm mb-1">Interest Rate: {interestRate}%</p>
                <p className="text-sm font-medium">Monthly Payment: Rp {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-sm mt-2">Total Repayment: Rp {(monthlyPayment * term).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" disabled={createLoan.isPending}>
                {createLoan.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
