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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { ProcessLoanDialog } from "@/components/modals/process-loan-dialog";
import { RecordSavingsDialog } from "@/components/modals/record-savings-dialog";
import { formatCurrency, formatDate, getStatusBadgeColor } from "@/lib/utils";
import { Loader2, PlusCircle, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { Loan } from "@shared/schema";

export default function Loans() {
  const [activeTab, setActiveTab] = useState("active");
  const [processLoanOpen, setProcessLoanOpen] = useState(false);
  const [repayLoanOpen, setRepayLoanOpen] = useState(false);
  
  // Fetch loans stats
  const { data: loanStats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/loans/stats"],
  });
  
  // Fetch loans by status
  const { data: loans, isLoading: loadingLoans } = useQuery<Loan[]>({
    queryKey: ["/api/loans", { status: activeTab }],
    queryFn: async ({ queryKey }) => {
      const [_, { status }] = queryKey as [string, { status: string }];
      const res = await fetch(`/api/loans?status=${status}`);
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });
  
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600 mr-2" />;
      case "rejected":
      case "defaulted":
        return <XCircle className="h-4 w-4 text-red-600 mr-2" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600 mr-2" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Loans - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
              <p className="text-muted-foreground">Manage member loans and applications</p>
            </div>
            <Button onClick={() => setProcessLoanOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Loan Application
            </Button>
          </header>
          
          {/* Loans Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard 
              title="Active Loans" 
              value={!loadingStats ? loanStats?.activeLoans || 0 : 0}
              icon="loans"
              className="md:col-span-1"
            />
            <StatsCard 
              title="Pending Applications" 
              value={!loadingStats ? loanStats?.pendingLoans || 0 : 0}
              icon="loans"
              className="md:col-span-1"
            />
            <StatsCard 
              title="Total Loans Disbursed" 
              value={!loadingStats ? (
                loanStats?.monthlyLoans?.reduce((acc, curr) => acc + curr.amount, 0) || 0
              ) : 0}
              icon="loans"
              className="md:col-span-1"
            />
          </div>
          
          {/* Loans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications and Status</CardTitle>
              <CardDescription>Manage loan applications, approvals, and repayments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active Loans</TabsTrigger>
                  <TabsTrigger value="pending">Pending Applications</TabsTrigger>
                  <TabsTrigger value="completed">Completed Loans</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected Applications</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {loadingLoans ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : loans && loans.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Term</TableHead>
                            <TableHead>Interest Rate</TableHead>
                            <TableHead>Monthly Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loans.map((loan) => (
                            <TableRow key={loan.id}>
                              <TableCell className="font-medium">{`Member #${loan.memberId}`}</TableCell>
                              <TableCell className="font-mono">{formatCurrency(loan.amount)}</TableCell>
                              <TableCell>{loan.term} months</TableCell>
                              <TableCell>{loan.interestRate}%</TableCell>
                              <TableCell className="font-mono">{formatCurrency(loan.monthlyPayment || 0)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {renderStatusIcon(loan.status)}
                                  <Badge className={getStatusBadgeColor(loan.status)}>
                                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                {activeTab === "active" ? (
                                  <Button size="sm" onClick={() => setRepayLoanOpen(true)}>
                                    Record Payment
                                  </Button>
                                ) : activeTab === "pending" ? (
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                                      Approve
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                                      Reject
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <p className="text-muted-foreground">No loans found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Loan Data</Button>
              <Button variant="outline" onClick={() => setProcessLoanOpen(true)}>
                New Loan Application
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <ProcessLoanDialog open={processLoanOpen} onOpenChange={setProcessLoanOpen} />
      <RecordSavingsDialog 
        open={repayLoanOpen} 
        onOpenChange={setRepayLoanOpen} 
      />
    </div>
  );
}
