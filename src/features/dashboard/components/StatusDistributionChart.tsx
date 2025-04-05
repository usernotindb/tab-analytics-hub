
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatusDataPoint, ChartContainerProps } from "../types";
import { ChartContainer } from "./ChartContainer";

interface StatusDistributionChartProps extends ChartContainerProps {
  data: StatusDataPoint[];
}

export const StatusDistributionChart = ({
  data,
  isLoading,
  title = "Status Distribution"
}: StatusDistributionChartProps) => {
  const isMobile = useIsMobile();

  return (
    <ChartContainer title={title} isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={isMobile ? 90 : 100}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
