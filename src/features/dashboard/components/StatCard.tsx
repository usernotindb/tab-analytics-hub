
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StatCardProps } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color,
  isLoading
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-in">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs flex items-center pt-1 text-muted-foreground">
              {trend === "up" ? 
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" /> : 
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              }
              <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
                {change}
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
