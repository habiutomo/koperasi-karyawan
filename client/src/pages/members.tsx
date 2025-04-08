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
  CardDescription 
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
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddMemberDialog } from "@/components/modals/add-member-dialog";
import { formatDate, getStatusBadgeColor } from "@/lib/utils";
import { Loader2, PlusCircle, Search, Edit, Trash, UserCog } from "lucide-react";
import { Member } from "@shared/schema";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  
  // Fetch members data
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });
  
  // Filter members based on search query and status
  const filteredMembers = members?.filter(member => {
    const matchesSearch = !searchQuery || 
      member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Members - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Members</h1>
              <p className="text-muted-foreground">Manage cooperative members and their accounts</p>
            </div>
            <Button onClick={() => setAddMemberOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </header>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Members Directory</CardTitle>
              <CardDescription>View and manage all cooperative members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-[180px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMembers && filteredMembers.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Monthly Contribution</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.employeeId}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{formatDate(member.joinDate)}</TableCell>
                          <TableCell className="font-mono">Rp {member.monthlyContribution.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(member.status)}>
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1).replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="Edit member">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Manage account">
                                <UserCog className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Delete member">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">No members found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <AddMemberDialog open={addMemberOpen} onOpenChange={setAddMemberOpen} />
    </div>
  );
}
