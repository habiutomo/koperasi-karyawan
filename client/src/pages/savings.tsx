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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/stats-card";
import { RecordSavingsDialog } from "@/components/modals/record-savings-dialog";
import { TransactionsTable } from "@/components/transactions-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, PlusCircle, Download, ArrowUpDown, Search } from "lucide-react";
import { Saving, Transaction } from "@shared/schema";

export default function Savings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recordSavingsOpen, setRecordSavingsOpen] = useState(false);
  
  // Fetch savings data
  const { data: savings, isLoading: loadingSavings } = useQuery<Saving[]>({
    queryKey: ["/api/savings"],
  });
  
  // Fetch savings stats
  const { data: savingsStats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/savings/stats"],
  });
  
  // Fetch recent savings transactions
  const { data: transactions, isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  // Filter savings-related transactions
  const savingsTransactions = transactions?.filter(transaction => 
    transaction.type === 'deposit' || transaction.type === 'withdrawal'
  ).map(transaction => ({
    ...transaction,
    member: {
      name: `Member #${transaction.memberId}`,
      avatar: ""
    }
  })).slice(0, 5);
  
  // Filter savings based on search
  const filteredSavings = savings?.filter(saving => {
    if (!searchQuery) return true;
    return `Member #${saving.memberId}`.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Savings - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Savings</h1>
              <p className="text-muted-foreground">Manage member savings and transactions</p>
            </div>
            <Button onClick={() => setRecordSavingsOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Transaction
            </Button>
          </header>
          
          {/* Savings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard 
              title="Total Savings" 
              value={!loadingStats ? savingsStats?.totalSavings || 0 : 0}
              icon="savings"
              change={!loadingStats && savingsStats?.monthlySavings?.[0] ? {
                value: `+${(savingsStats.monthlySavings[0].amount / savingsStats.totalSavings * 100).toFixed(1)}% this month`,
                positive: true
              } : undefined}
              className="md:col-span-3"
            />
          </div>
          
          {/* Recent Transactions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Savings Transactions</CardTitle>
              <CardDescription>View the latest deposits and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable 
                transactions={savingsTransactions || []} 
                loading={loadingTransactions} 
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Transactions
              </Button>
            </CardFooter>
          </Card>
          
          {/* Savings Balances */}
          <Card>
            <CardHeader>
              <CardTitle>Member Savings Balances</CardTitle>
              <CardDescription>View current savings for all members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {loadingSavings ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredSavings && filteredSavings.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" className="p-0 h-8 w-full justify-start font-medium">
                            Member ID
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" className="p-0 h-8 w-full justify-start font-medium">
                            Current Balance
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" className="p-0 h-8 w-full justify-start font-medium">
                            Last Update
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSavings.map((saving) => (
                        <TableRow key={saving.id}>
                          <TableCell className="font-medium">{`Member #${saving.memberId}`}</TableCell>
                          <TableCell className="font-mono">{formatCurrency(saving.totalSavings)}</TableCell>
                          <TableCell>{formatDate(saving.lastUpdate)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => setRecordSavingsOpen(true)}>
                              Record Transaction
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">No savings accounts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <RecordSavingsDialog open={recordSavingsOpen} onOpenChange={setRecordSavingsOpen} />
    </div>
  );
}
