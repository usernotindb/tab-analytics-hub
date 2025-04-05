
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomerDataPoint, ChartContainerProps } from "../types";
import { ChartContainer } from "./ChartContainer";

interface CustomerGrowthChartProps extends ChartContainerProps {
  data: CustomerDataPoint[];
}

export const CustomerGrowthChart = ({ 
  data, 
  isLoading,
  title = "Customer Growth"
}: CustomerGrowthChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <ChartContainer title={title} isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 20 }}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }} 
          />
          <Bar dataKey="customers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
