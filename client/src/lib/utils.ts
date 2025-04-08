import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'Rp'): string {
  return `${currency} ${amount.toLocaleString('id-ID')}`;
}

export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd MMM yyyy');
}

export function shortenName(name: string): string {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return name;
  return `${parts[0]} ${parts[1][0]}.`;
}

export function calculateMonthlyPayment(principal: number, interestRate: number, terms: number): number {
  const monthlyRate = interestRate / 100 / 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, terms)) / (Math.pow(1 + monthlyRate, terms) - 1);
}

export function getStatusBadgeColor(status: string): string {
  const statusMap: Record<string, string> = {
    // Member statuses
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'new': 'bg-blue-100 text-blue-800',
    'on_leave': 'bg-amber-100 text-amber-800',
    
    // Transaction statuses
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-blue-100 text-blue-800',
    'cancelled': 'bg-gray-100 text-gray-800',
    'failed': 'bg-red-100 text-red-800',
    
    // Loan statuses
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'defaulted': 'bg-red-100 text-red-800',
    
    // Default
    'default': 'bg-gray-100 text-gray-800',
  };
  
  return statusMap[status] || statusMap.default;
}

export function getTransactionTypeColor(type: string): string {
  const typeMap: Record<string, string> = {
    'deposit': 'bg-green-100 text-green-800',
    'withdrawal': 'bg-red-100 text-red-800',
    'loan_disbursement': 'bg-amber-100 text-amber-800',
    'loan_repayment': 'bg-blue-100 text-blue-800',
    'dividend_payment': 'bg-purple-100 text-purple-800',
    'default': 'bg-gray-100 text-gray-800',
  };
  
  return typeMap[type] || typeMap.default;
}
