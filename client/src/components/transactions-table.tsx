import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusBadgeColor, getTransactionTypeColor } from "@/lib/utils";
import { CheckCircle, Info, AlertCircle, Clock } from "lucide-react";
import { Transaction, User, Member } from "@shared/schema";

interface TransactionsTableProps {
  transactions: (Transaction & { 
    member?: { 
      name: string;
      avatar?: string;
    };
  })[];
  loading?: boolean;
}

export function TransactionsTable({ transactions, loading = false }: TransactionsTableProps) {
  const renderType = (type: string) => {
    const typeDisplay = type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return (
      <Badge className={getTransactionTypeColor(type)}>
        {typeDisplay}
      </Badge>
    );
  };
  
  const renderStatus = (status: string) => {
    let icon;
    
    switch (status) {
      case "completed":
        icon = <CheckCircle className="h-4 w-4 mr-1 text-green-600" />;
        break;
      case "pending":
        icon = <Clock className="h-4 w-4 mr-1 text-blue-600" />;
        break;
      case "failed":
        icon = <AlertCircle className="h-4 w-4 mr-1 text-red-600" />;
        break;
      default:
        icon = <Info className="h-4 w-4 mr-1 text-gray-600" />;
    }
    
    return (
      <div className="flex items-center">
        {icon}
        <span className="capitalize">{status}</span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={transaction.member?.avatar || ""} />
                    <AvatarFallback>
                      {transaction.member?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {transaction.member?.name || `Member #${transaction.memberId}`}
                  </span>
                </div>
              </TableCell>
              <TableCell>{renderType(transaction.type)}</TableCell>
              <TableCell className="font-mono">
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>{renderStatus(transaction.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
