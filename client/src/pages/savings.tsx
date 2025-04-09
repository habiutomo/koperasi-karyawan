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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">Simpanan Anggota</h1>
              <p className="text-muted-foreground">Kelola simpanan dan transaksi anggota koperasi</p>
            </div>
            <Button onClick={() => setRecordSavingsOpen(true)} className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Catat Transaksi
            </Button>
          </header>
          
          {/* Savings Overview Banner */}
          <div className="rounded-lg overflow-hidden mb-6 shadow-lg border border-primary/10">
            <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Program Simpanan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Program simpanan kami menawarkan beberapa keuntungan:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-primary">✓</span>
                      Simpanan pokok Rp 500.000 dibayar saat menjadi anggota
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-primary">✓</span>
                      Simpanan wajib Rp 100.000 per bulan
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-primary">✓</span>
                      Simpanan sukarela dengan bunga kompetitif
                    </li>
                  </ul>
                </div>
                <div>
                  <StatsCard 
                    title="Total Simpanan" 
                    value={!loadingStats ? savingsStats?.totalSavings || 0 : 0}
                    icon="savings"
                    change={!loadingStats && savingsStats?.monthlySavings?.[0] ? {
                      value: `+${(savingsStats.monthlySavings[0].amount / (savingsStats.totalSavings || 1) * 100).toFixed(1)}% bulan ini`,
                      positive: true
                    } : undefined}
                    className="h-full shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <Card className="mb-6 border border-gray-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-pink-500/5 border-b border-primary/10">
              <CardTitle>Transaksi Simpanan Terbaru</CardTitle>
              <CardDescription>Lihat setoran dan penarikan simpanan terbaru</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <TransactionsTable 
                transactions={savingsTransactions || []} 
                loading={loadingTransactions} 
              />
            </CardContent>
            <CardFooter className="flex justify-end bg-gray-50/50 border-t">
              <Button variant="outline" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                <Download className="mr-2 h-4 w-4" />
                Ekspor Transaksi
              </Button>
            </CardFooter>
          </Card>
          
          {/* Savings Balances */}
          <Card className="border border-gray-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-pink-500/5 border-b border-primary/10">
              <CardTitle>Saldo Simpanan Anggota</CardTitle>
              <CardDescription>Lihat saldo simpanan seluruh anggota koperasi</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari anggota..."
                    className="pl-8 border-primary/20 focus:border-primary"
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
                        <TableHead className="bg-gray-50">
                          <Button variant="ghost" className="p-0 h-8 w-full justify-start font-medium">
                            ID Anggota
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="bg-gray-50">
                          <Button variant="ghost" className="p-0 h-8 w-full justify-start font-medium">
                            Saldo Saat Ini
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="bg-gray-50">
                          <Button variant="ghost" className="p-0 h-8 w-full justify-start font-medium">
                            Pembaruan Terakhir
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right bg-gray-50">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSavings.map((saving) => (
                        <TableRow key={saving.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium">{`Anggota #${saving.memberId}`}</TableCell>
                          <TableCell className="font-mono font-semibold text-primary">{formatCurrency(saving.totalSavings)}</TableCell>
                          <TableCell>{formatDate(saving.lastUpdate)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              onClick={() => setRecordSavingsOpen(true)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Catat Transaksi
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center p-8">
                  <p className="text-muted-foreground text-center mb-4">Belum ada akun simpanan yang ditemukan</p>
                  <Button onClick={() => setRecordSavingsOpen(true)} variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Akun Simpanan Baru
                  </Button>
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
