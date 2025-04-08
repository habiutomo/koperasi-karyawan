import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  PiggyBank, 
  FileText, 
  CreditCard 
} from "lucide-react";

interface QuickActionsProps {
  onAddMember: () => void;
  onRecordSavings: () => void;
  onProcessLoan: () => void;
  onCreateReport: () => void;
}

export function QuickActions({ 
  onAddMember, 
  onRecordSavings, 
  onProcessLoan,
  onCreateReport
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        variant="outline"
        className="bg-white shadow hover:shadow-md transition-all p-4 h-auto flex flex-col items-center justify-center"
        onClick={onAddMember}
      >
        <div className="bg-blue-100 rounded-full p-3 mb-2">
          <UserPlus className="h-5 w-5 text-blue-500" />
        </div>
        <span className="text-sm font-medium">Add Member</span>
      </Button>
      
      <Button
        variant="outline"
        className="bg-white shadow hover:shadow-md transition-all p-4 h-auto flex flex-col items-center justify-center"
        onClick={onRecordSavings}
      >
        <div className="bg-green-100 rounded-full p-3 mb-2">
          <PiggyBank className="h-5 w-5 text-green-500" />
        </div>
        <span className="text-sm font-medium">Record Savings</span>
      </Button>
      
      <Button
        variant="outline"
        className="bg-white shadow hover:shadow-md transition-all p-4 h-auto flex flex-col items-center justify-center"
        onClick={onProcessLoan}
      >
        <div className="bg-amber-100 rounded-full p-3 mb-2">
          <CreditCard className="h-5 w-5 text-amber-500" />
        </div>
        <span className="text-sm font-medium">Process Loan</span>
      </Button>
      
      <Button
        variant="outline"
        className="bg-white shadow hover:shadow-md transition-all p-4 h-auto flex flex-col items-center justify-center"
        onClick={onCreateReport}
      >
        <div className="bg-purple-100 rounded-full p-3 mb-2">
          <FileText className="h-5 w-5 text-purple-500" />
        </div>
        <span className="text-sm font-medium">Create Report</span>
      </Button>
    </div>
  );
}
