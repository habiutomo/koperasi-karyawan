import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  DollarSign, 
  Users, 
  Calendar, 
  PiggyBank, 
  BadgeCheck 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: "users" | "savings" | "loans" | "dividends";
  className?: string;
}

export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  // Format value if it's a number
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value;
  
  // Determine icon component
  const iconMap = {
    users: <Users className="h-5 w-5" />,
    savings: <PiggyBank className="h-5 w-5" />,
    loans: <CreditCard className="h-5 w-5" />,
    dividends: <DollarSign className="h-5 w-5" />,
  };
  
  // Determine icon background color
  const iconColorMap = {
    users: "bg-blue-100 text-blue-600",
    savings: "bg-green-100 text-green-600",
    loans: "bg-amber-100 text-amber-600",
    dividends: "bg-purple-100 text-purple-600",
  };
  
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <h2 className="text-2xl font-bold mt-1 font-mono">{formattedValue}</h2>
            {change && (
              <p 
                className={cn(
                  "text-xs flex items-center mt-1",
                  change.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {change.positive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {change.value}
              </p>
            )}
          </div>
          <div className={cn("rounded-full p-3 flex items-center justify-center", iconColorMap[icon])}>
            {iconMap[icon]}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
