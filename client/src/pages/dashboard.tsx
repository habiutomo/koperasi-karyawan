import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { StatsCard } from "@/components/stats-card";
import { TransactionsTable } from "@/components/transactions-table";
import { PendingTasks } from "@/components/pending-tasks";
import { MembershipChart } from "@/components/charts/membership-chart";
import { FinancialChart } from "@/components/charts/financial-chart";
import { QuickActions } from "@/components/quick-actions";
import { AddMemberDialog } from "@/components/modals/add-member-dialog";
import { RecordSavingsDialog } from "@/components/modals/record-savings-dialog";
import { ProcessLoanDialog } from "@/components/modals/process-loan-dialog";
import { GenerateReportDialog } from "@/components/modals/generate-report-dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Dialog states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [recordSavingsOpen, setRecordSavingsOpen] = useState(false);
  const [processLoanOpen, setProcessLoanOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);

  // Fetch dashboard data
  const { data: memberStats, isLoading: loadingMemberStats } = useQuery({
    queryKey: ["/api/members/stats"],
  });

  const { data: savingsStats, isLoading: loadingSavingsStats } = useQuery({
    queryKey: ["/api/savings/stats"],
  });

  const { data: loanStats, isLoading: loadingLoanStats } = useQuery({
    queryKey: ["/api/loans/stats"],
  });

  const { data: latestDividend, isLoading: loadingDividend } = useQuery({
    queryKey: ["/api/dividends/latest"],
  });

  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ["/api/tasks/pending"],
  });

  // Handle task actions
  const handleViewTask = (taskId: number) => {
    toast({
      title: "Task viewer",
      description: `Viewing details for task #${taskId}`,
    });
  };

  const handleProcessTask = (taskId: number) => {
    toast({
      title: "Processing task",
      description: `Opening workflow for task #${taskId}`,
    });
  };

  // Prepare transaction data
  const transactionsWithMembers = transactions?.map((transaction: any) => ({
    ...transaction,
    member: {
      name: `Member #${transaction.memberId}`,
      avatar: ""
    }
  })).slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Dashboard - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to Koperasi Karyawan Management System</p>
          </header>
          
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Total Members" 
              value={!loadingMemberStats ? memberStats?.total : "--"}
              icon="users"
              change={!loadingMemberStats ? {
                value: `+${memberStats?.new || 0} this month`,
                positive: true
              } : undefined}
            />
            
            <StatsCard 
              title="Total Savings" 
              value={!loadingSavingsStats ? savingsStats?.totalSavings || 0 : 0}
              icon="savings"
              change={!loadingSavingsStats && savingsStats?.monthlySavings?.[0] ? {
                value: `+${(savingsStats.monthlySavings[0].amount / (savingsStats.totalSavings || 1) * 100).toFixed(1)}% this month`,
                positive: true
              } : undefined}
            />
            
            <StatsCard 
              title="Active Loans" 
              value={!loadingLoanStats ? loanStats?.activeLoans || 0 : 0}
              icon="loans"
              change={!loadingLoanStats && loanStats?.monthlyLoans?.[0] ? {
                value: `+${(loanStats.monthlyLoans[0].amount / (loanStats.activeLoans || 1) * 100).toFixed(1)}% this month`,
                positive: false
              } : undefined}
            />
            
            <StatsCard 
              title="Last Dividends" 
              value={!loadingDividend && latestDividend ? latestDividend.totalAmount : 0}
              icon="dividends"
              change={!loadingDividend && latestDividend ? {
                value: `${latestDividend.month}/${latestDividend.year}`,
                positive: true
              } : undefined}
            />
          </div>
          
          {/* Recent Activity and Pending Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="font-bold text-lg">Recent Transactions</h2>
                <button 
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                  onClick={() => navigate('/transactions')}
                >
                  View All
                </button>
              </div>
              <div className="p-4">
                <TransactionsTable 
                  transactions={transactionsWithMembers || []} 
                  loading={loadingTransactions} 
                />
              </div>
            </div>
            
            <PendingTasks 
              tasks={tasks || []} 
              loading={loadingTasks}
              onViewTask={handleViewTask}
              onProcessTask={handleProcessTask}
            />
          </div>
          
          {/* Membership Status and Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MembershipChart 
              data={{
                active: memberStats?.active || 0,
                inactive: memberStats?.inactive || 0,
                new: memberStats?.new || 0,
                onLeave: memberStats?.onLeave || 0
              }}
              loading={loadingMemberStats}
              onViewReport={() => navigate('/reports/members')}
            />
            
            <FinancialChart 
              savingsData={savingsStats?.monthlySavings || []}
              loansData={loanStats?.monthlyLoans || []}
              loading={loadingSavingsStats || loadingLoanStats}
              onGenerateReport={() => setGenerateReportOpen(true)}
            />
          </div>
          
          {/* Quick Action Buttons */}
          <QuickActions 
            onAddMember={() => setAddMemberOpen(true)}
            onRecordSavings={() => setRecordSavingsOpen(true)}
            onProcessLoan={() => setProcessLoanOpen(true)}
            onCreateReport={() => setGenerateReportOpen(true)}
          />
        </div>
      </main>
      
      {/* Dialogs */}
      <AddMemberDialog open={addMemberOpen} onOpenChange={setAddMemberOpen} />
      <RecordSavingsDialog open={recordSavingsOpen} onOpenChange={setRecordSavingsOpen} />
      <ProcessLoanDialog open={processLoanOpen} onOpenChange={setProcessLoanOpen} />
      <GenerateReportDialog open={generateReportOpen} onOpenChange={setGenerateReportOpen} />
    </div>
  );
}
