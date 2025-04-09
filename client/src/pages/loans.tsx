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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">Pinjaman</h1>
              <p className="text-muted-foreground">Kelola pinjaman dan aplikasi pengajuan anggota</p>
            </div>
            <Button onClick={() => setProcessLoanOpen(true)} className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajukan Pinjaman Baru
            </Button>
          </header>
          
          {/* Loans Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard 
              title="Pinjaman Aktif" 
              value={!loadingStats ? loanStats?.activeLoans || 0 : 0}
              icon="loans"
              className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow border border-primary/10 hover:border-primary/20"
            />
            <StatsCard 
              title="Pengajuan Tertunda" 
              value={!loadingStats ? loanStats?.pendingLoans || 0 : 0}
              icon="loans"
              className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow border border-primary/10 hover:border-primary/20"
            />
            <StatsCard 
              title="Total Pinjaman Disalurkan" 
              value={!loadingStats ? (
                loanStats?.monthlyLoans?.reduce((acc, curr) => acc + curr.amount, 0) || 0
              ) : 0}
              icon="loans"
              className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow border border-primary/10 hover:border-primary/20"
            />
          </div>
          
          {/* Loans Table */}
          <Card className="shadow-lg border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-pink-500/5 border-b border-primary/10">
              <CardTitle>Daftar Pinjaman dan Status</CardTitle>
              <CardDescription>Kelola pengajuan pinjaman, persetujuan, dan pembayaran cicilan</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 bg-gray-100/80">
                  <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pinjaman Aktif</TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pengajuan Tertunda</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pinjaman Selesai</TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pengajuan Ditolak</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {loadingLoans ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : loans && loans.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold">Anggota</TableHead>
                            <TableHead className="font-semibold">Jumlah</TableHead>
                            <TableHead className="font-semibold">Jangka Waktu</TableHead>
                            <TableHead className="font-semibold">Bunga</TableHead>
                            <TableHead className="font-semibold">Cicilan Bulanan</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loans.map((loan) => (
                            <TableRow key={loan.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{`Anggota #${loan.memberId}`}</TableCell>
                              <TableCell className="font-mono font-semibold text-primary">{formatCurrency(loan.amount)}</TableCell>
                              <TableCell>{loan.term} bulan</TableCell>
                              <TableCell>{loan.interestRate}%</TableCell>
                              <TableCell className="font-mono">{formatCurrency(loan.monthlyPayment || 0)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {renderStatusIcon(loan.status)}
                                  <Badge className={getStatusBadgeColor(loan.status)}>
                                    {/* Terjemahkan status ke Bahasa Indonesia */}
                                    {loan.status === "active" ? "Aktif" : 
                                     loan.status === "pending" ? "Tertunda" :
                                     loan.status === "completed" ? "Selesai" :
                                     loan.status === "approved" ? "Disetujui" :
                                     loan.status === "rejected" ? "Ditolak" :
                                     loan.status === "defaulted" ? "Macet" : 
                                     loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                {activeTab === "active" ? (
                                  <Button size="sm" onClick={() => setRepayLoanOpen(true)} className="bg-primary hover:bg-primary/90">
                                    Catat Pembayaran
                                  </Button>
                                ) : activeTab === "pending" ? (
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                                      Setujui
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                                      Tolak
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline">
                                    Lihat Detail
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center p-8">
                      <p className="text-muted-foreground text-center mb-4">Belum ada data pinjaman untuk kategori ini</p>
                      <Button onClick={() => setProcessLoanOpen(true)} variant="outline" className="border-primary text-primary hover:bg-primary/5">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajukan Pinjaman Baru
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50/50 border-t">
              <Button variant="outline" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                Ekspor Data Pinjaman
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setProcessLoanOpen(true)} 
                className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20 hover:border-primary/40"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajukan Pinjaman Baru
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
