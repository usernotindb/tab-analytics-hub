
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  Bar
} from "recharts";
import { ReportVisualizationProps } from "../types";
import { getValueLabel } from "../utils/reportHelpers";

export const ReportVisualization = ({ 
  reportData, 
  isLoading, 
  selectedChart, 
  reportType 
}: ReportVisualizationProps) => {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (reportData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        No data available for the selected criteria
      </div>
    );
  }
  
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  
  switch (selectedChart) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportData} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name={getValueLabel(reportType)} />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case "line":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={reportData} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" name={getValueLabel(reportType)} />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={reportData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {reportData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
      
    default:
      return null;
  }
};
