import { useState } from "react";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GenerateReportDialog } from "@/components/modals/generate-report-dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, Printer } from "lucide-react";

// Mock data for the reports
const membershipData = [
  { name: "Active", value: 210, color: "#1976D2" },
  { name: "New", value: 15, color: "#4CAF50" },
  { name: "Inactive", value: 23, color: "#9E9E9E" },
  { name: "On Leave", value: 8, color: "#FFC107" },
];

const monthlySavingsData = [
  { name: "Jan", savings: 125000000, loans: 85000000 },
  { name: "Feb", savings: 145000000, loans: 78000000 },
  { name: "Mar", savings: 118000000, loans: 92000000 },
  { name: "Apr", savings: 162000000, loans: 74000000 },
  { name: "May", savings: 178000000, loans: 88000000 },
  { name: "Jun", savings: 0, loans: 0 }, // Future month
];

const loanStatusData = [
  { name: "Approved", value: 35, color: "#4CAF50" },
  { name: "Pending", value: 12, color: "#FFC107" },
  { name: "Completed", value: 65, color: "#1976D2" },
  { name: "Rejected", value: 8, color: "#F44336" },
];

const COLORS = ["#1976D2", "#4CAF50", "#9E9E9E", "#FFC107"];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("financial");
  const [reportPeriod, setReportPeriod] = useState("this_month");
  const [generateReportOpen, setGenerateReportOpen] = useState(false);
  
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Reports - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-muted-foreground">Generate and view cooperative reports</p>
            </div>
            <Button onClick={() => setGenerateReportOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Generate New Report
            </Button>
          </header>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Cooperative Reports</CardTitle>
                  <CardDescription>View and analyze cooperative performance</CardDescription>
                </div>
                <div className="w-full sm:w-[240px]">
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="this_quarter">This Quarter</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="financial">Financial Summary</TabsTrigger>
                  <TabsTrigger value="membership">Membership</TabsTrigger>
                  <TabsTrigger value="loans">Loans</TabsTrigger>
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="financial">
                  <div className="h-[500px] p-4">
                    <h3 className="text-lg font-medium mb-4">Monthly Financial Trends</h3>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={monthlySavingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="savings" name="Savings" fill="#1976D2" />
                        <Bar dataKey="loans" name="Loans" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="membership">
                  <div className="h-[500px] p-4">
                    <h3 className="text-lg font-medium mb-4">Membership Distribution</h3>
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={membershipData}
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                              label={(entry) => `${entry.name}: ${entry.value}`}
                            >
                              {membershipData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} members`, "Count"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 mt-4 md:mt-0">
                        <h4 className="text-md font-medium mb-2">Membership Summary</h4>
                        <p className="mb-4">Total Members: {membershipData.reduce((acc, curr) => acc + curr.value, 0)}</p>
                        
                        <div className="space-y-4">
                          {membershipData.map((status, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className="h-3 w-3 rounded-full mr-2" 
                                  style={{ backgroundColor: status.color }}
                                />
                                <span>{status.name} Members</span>
                              </div>
                              <span className="font-medium">{status.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="loans">
                  <div className="h-[500px] p-4">
                    <h3 className="text-lg font-medium mb-4">Loan Status Distribution</h3>
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={loanStatusData}
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                              label={(entry) => `${entry.name}: ${entry.value}`}
                            >
                              {loanStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} loans`, "Count"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 mt-4 md:mt-0">
                        <h4 className="text-md font-medium mb-2">Loan Summary</h4>
                        <p className="mb-4">Total Loans: {loanStatusData.reduce((acc, curr) => acc + curr.value, 0)}</p>
                        
                        <div className="space-y-4">
                          {loanStatusData.map((status, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className="h-3 w-3 rounded-full mr-2" 
                                  style={{ backgroundColor: status.color }}
                                />
                                <span>{status.name} Loans</span>
                              </div>
                              <span className="font-medium">{status.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="savings">
                  <div className="h-[500px] p-4">
                    <h3 className="text-lg font-medium mb-4">Savings Growth</h3>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={monthlySavingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="savings" name="Savings" fill="#1976D2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <GenerateReportDialog open={generateReportOpen} onOpenChange={setGenerateReportOpen} />
    </div>
  );
}
