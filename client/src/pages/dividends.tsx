import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { formatCurrency, formatDate, getStatusBadgeColor } from "@/lib/utils";
import { Loader2, PlusCircle, Download, Calculator } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dividend, DividendDistribution } from "@shared/schema";

const dividendFormSchema = z.object({
  year: z.string().min(4, "Year is required"),
  month: z.string().min(1, "Month is required"),
  totalAmount: z.string().min(1, "Total amount is required"),
  distributionDate: z.string().min(1, "Distribution date is required"),
  description: z.string().optional(),
});

export default function Dividends() {
  const [distributeDividendsOpen, setDistributeDividendsOpen] = useState(false);
  
  // Fetch dividends
  const { data: dividends, isLoading: loadingDividends } = useQuery<Dividend[]>({
    queryKey: ["/api/dividends"],
  });
  
  // Fetch latest dividend
  const { data: latestDividend, isLoading: loadingLatest } = useQuery<Dividend>({
    queryKey: ["/api/dividends/latest"],
  });
  
  // Fetch latest dividend distributions
  const { data: distributions, isLoading: loadingDistributions } = useQuery<DividendDistribution[]>({
    queryKey: ["/api/dividends/distributions", latestDividend?.id],
    queryFn: async ({ queryKey }) => {
      const [_, dividendId] = queryKey;
      if (!dividendId) return [];
      const res = await fetch(`/api/dividends/${dividendId}/distributions`);
      if (!res.ok) throw new Error("Failed to fetch distributions");
      return res.json();
    },
    enabled: !!latestDividend?.id,
  });
  
  const form = useForm<z.infer<typeof dividendFormSchema>>({
    resolver: zodResolver(dividendFormSchema),
    defaultValues: {
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString(),
      totalAmount: "",
      distributionDate: new Date().toISOString().split('T')[0],
      description: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof dividendFormSchema>) => {
    console.log(values);
    // Handle dividend distribution
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Dividends - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dividends</h1>
              <p className="text-muted-foreground">Manage dividend calculation and distribution</p>
            </div>
            <Button onClick={() => setDistributeDividendsOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Distribute Dividends
            </Button>
          </header>
          
          {/* Dividends Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard 
              title="Latest Dividend" 
              value={!loadingLatest && latestDividend ? latestDividend.totalAmount : 0}
              icon="dividends"
              change={!loadingLatest && latestDividend ? {
                value: `${latestDividend.month}/${latestDividend.year}`,
                positive: true
              } : undefined}
              className="md:col-span-3"
            />
          </div>
          
          {/* Dividend History */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dividend History</CardTitle>
              <CardDescription>Previous dividend distributions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDividends ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : dividends && dividends.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Distribution Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dividends.map((dividend) => (
                        <TableRow key={dividend.id}>
                          <TableCell className="font-medium">{`${dividend.month}/${dividend.year}`}</TableCell>
                          <TableCell className="font-mono">{formatCurrency(dividend.totalAmount)}</TableCell>
                          <TableCell>{formatDate(dividend.distributionDate)}</TableCell>
                          <TableCell>{dividend.description || "-"}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              View Distributions
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No dividend history found</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Dividend History
              </Button>
            </CardFooter>
          </Card>
          
          {/* Latest Distributions */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Dividend Distributions</CardTitle>
              <CardDescription>
                Member-wise breakdown of the latest dividend distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDistributions || !latestDividend ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : distributions && distributions.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Distribution Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributions.map((distribution) => (
                        <TableRow key={distribution.id}>
                          <TableCell className="font-medium">{`Member #${distribution.memberId}`}</TableCell>
                          <TableCell className="font-mono">{formatCurrency(distribution.amount)}</TableCell>
                          <TableCell>{formatDate(distribution.distributionDate)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(distribution.status)}>
                              {distribution.status.charAt(0).toUpperCase() + distribution.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No distributions found for the latest dividend</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Distribute Dividends Dialog */}
      <Dialog open={distributeDividendsOpen} onOpenChange={setDistributeDividendsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Distribute Dividends</DialogTitle>
            <DialogDescription>
              Calculate and distribute dividends to cooperative members
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distributionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distribution Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" className="mr-2">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button type="submit">Distribute Dividends</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
