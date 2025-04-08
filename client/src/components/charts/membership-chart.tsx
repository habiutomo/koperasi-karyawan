import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MembershipData {
  active: number;
  inactive: number;
  new: number;
  onLeave: number;
}

interface MembershipChartProps {
  data: MembershipData;
  loading?: boolean;
  onViewReport?: () => void;
}

export function MembershipChart({ data, loading = false, onViewReport }: MembershipChartProps) {
  // Calculate total and percentages
  const total = data.active + data.inactive + data.new + data.onLeave;
  const activePercentage = total > 0 ? Math.round((data.active / total) * 100) : 0;
  const inactivePercentage = total > 0 ? Math.round((data.inactive / total) * 100) : 0;
  const newPercentage = total > 0 ? Math.round((data.new / total) * 100) : 0;
  const onLeavePercentage = total > 0 ? Math.round((data.onLeave / total) * 100) : 0;
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Membership Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative inline-block">
          <div className="h-32 w-32 rounded-full border-8 border-green-500 relative flex items-center justify-center">
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent border-l-blue-500 border-t-blue-500"
              style={{ transform: `rotate(${activePercentage * 3.6 + 90}deg)` }}
            />
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent border-l-amber-500 border-t-amber-500" 
              style={{ transform: `rotate(${(activePercentage + newPercentage) * 3.6 + 90}deg)` }}
            />
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent border-l-gray-300 border-t-gray-300" 
              style={{ transform: `rotate(${(activePercentage + newPercentage + onLeavePercentage) * 3.6 + 90}deg)` }}
            />
            <p className="font-bold text-2xl">{activePercentage}%</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 w-48 mx-auto">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Active ({data.active})</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">New ({data.new})</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm">Inactive ({data.inactive})</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
            <span className="text-sm">On Leave ({data.onLeave})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary flex items-center"
          onClick={onViewReport}
        >
          View Detailed Report
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
