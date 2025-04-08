import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MonthlyData {
  month: number;
  year: number;
  amount: number;
}

interface FinancialChartProps {
  savingsData: MonthlyData[];
  loansData: MonthlyData[];
  loading?: boolean;
  onGenerateReport?: () => void;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function FinancialChart({ savingsData, loansData, loading = false, onGenerateReport }: FinancialChartProps) {
  const maxAmount = Math.max(
    ...savingsData.map(d => d.amount),
    ...loansData.map(d => d.amount)
  );
  
  // Normalize heights (max height 80%)
  const getHeight = (amount: number) => {
    return maxAmount > 0 ? (amount / maxAmount) * 80 : 0;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>
    );
  }
  
  // Render the last 6 months of data, most recent month first
  const displayData = savingsData
    .slice(0, 6)
    .map((item, index) => {
      return {
        month: monthNames[item.month],
        savingsAmount: item.amount,
        savingsHeight: getHeight(item.amount),
        loansAmount: loansData[index]?.amount || 0,
        loansHeight: getHeight(loansData[index]?.amount || 0)
      };
    })
    .reverse();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-center space-x-4">
          {displayData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-6 bg-blue-500 rounded-t" 
                style={{ height: `${item.savingsHeight}%` }}
                title={formatCurrency(item.savingsAmount)}
              />
              <div 
                className="w-6 bg-green-500 rounded-t mt-1" 
                style={{ height: `${item.loansHeight}%` }}
                title={formatCurrency(item.loansAmount)}
              />
              <p className="text-xs mt-2">{item.month}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Savings</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Loans</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary flex items-center"
          onClick={onGenerateReport}
        >
          Generate Financial Report
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
