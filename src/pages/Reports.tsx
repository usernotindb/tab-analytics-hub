
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useQuery } from "@tanstack/react-query";
import { 
  Bar, 
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
  Cell
} from "recharts";
import { toast } from "sonner";
import { 
  Download, 
  FileText, 
  Filter, 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Users
} from "lucide-react";
import apiService from "@/services/apiService";
import { useIsMobile } from "@/hooks/use-mobile";

const Reports = () => {
  const [reportType, setReportType] = useState("customer");
  const [dateRange, setDateRange] = useState({ from: new Date(2025, 0, 1), to: new Date() });
  const [selectedChart, setSelectedChart] = useState("bar");
  const isMobile = useIsMobile();
  
  // Fetch report data
  const { data: reportData = [], isLoading } = useQuery({
    queryKey: ['reports', reportType, dateRange],
    queryFn: async () => {
      try {
        // This would be a real API call in production
        // return await apiService.get(`/reports/${reportType}?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
        
        // For demo, return mock data based on report type
        switch (reportType) {
          case "customer":
            return getMockCustomerData();
          case "revenue":
            return getMockRevenueData();
          case "portal":
            return getMockPortalData();
          case "application":
            return getMockApplicationData();
          default:
            return [];
        }
      } catch (error) {
        toast.error("Failed to fetch report data");
        return [];
      }
    },
  });
  
  const handleExportReport = () => {
    toast.success("Report exported to CSV");
  };
  
  const renderChart = () => {
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
              <Bar dataKey="value" fill="#3b82f6" name={getValueLabel()} />
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
              <Line type="monotone" dataKey="value" stroke="#3b82f6" name={getValueLabel()} />
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
  
  const getValueLabel = () => {
    switch (reportType) {
      case "customer":
        return "Customers";
      case "revenue":
        return "Revenue ($)";
      case "portal":
        return "Portals";
      case "application":
        return "Applications";
      default:
        return "Value";
    }
  };
  
  const renderReportTitle = () => {
    switch (reportType) {
      case "customer":
        return "Customer Growth Report";
      case "revenue":
        return "Revenue Report";
      case "portal":
        return "Portal Installation Report";
      case "application":
        return "Bank Application Report";
      default:
        return "Report";
    }
  };
  
  const renderReportDescription = () => {
    switch (reportType) {
      case "customer":
        return "Monthly customer acquisition and retention trends";
      case "revenue":
        return "Revenue breakdown by software payment category";
      case "portal":
        return "Portal installation status and trends";
      case "application":
        return "Bank application submission and approval status";
      default:
        return "Report data and analysis";
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{renderReportTitle()}</h1>
          <p className="text-muted-foreground">{renderReportDescription()}</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>
            Select parameters to generate your custom report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer Report</SelectItem>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="portal">Portal Report</SelectItem>
                  <SelectItem value="application">Application Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Chart Type</label>
              <div className="flex space-x-2">
                <Button 
                  variant={selectedChart === "bar" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedChart("bar")}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button 
                  variant={selectedChart === "line" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedChart("line")}
                >
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  Line
                </Button>
                <Button 
                  variant={selectedChart === "pie" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedChart("pie")}
                >
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Pie
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pt-4">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Data</CardTitle>
          <CardDescription>
            Tabular representation of report data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {reportType === "customer" ? "Month" : "Category"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getValueLabel()}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {reportType === "revenue" ? "% of Total" : "% Change"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  reportData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reportType === "revenue" ? `$${item.value.toLocaleString()}` : item.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reportType === "revenue" 
                          ? `${((item.value / reportData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%`
                          : item.change ? item.change : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock data generators
function getMockCustomerData() {
  return [
    { name: "Jan", value: 42, change: "+5.0%" },
    { name: "Feb", value: 57, change: "+35.7%" },
    { name: "Mar", value: 72, change: "+26.3%" },
    { name: "Apr", value: 87, change: "+20.8%" },
    { name: "May", value: 103, change: "+18.4%" },
    { name: "Jun", value: 118, change: "+14.6%" },
  ];
}

function getMockRevenueData() {
  return [
    { name: "CRM Software", value: 45000 },
    { name: "Accounting", value: 32000 },
    { name: "Inventory", value: 28000 },
    { name: "Banking Apps", value: 18000 },
    { name: "Merchant Services", value: 15000 },
  ];
}

function getMockPortalData() {
  return [
    { name: "Ready", value: 75 },
    { name: "Not Ready", value: 35 },
    { name: "Installation Pending", value: 18 },
    { name: "Maintenance", value: 12 },
  ];
}

function getMockApplicationData() {
  return [
    { name: "Submitted", value: 62 },
    { name: "Processing", value: 35 },
    { name: "Approved", value: 48 },
    { name: "Rejected", value: 16 },
    { name: "Unsubmitted", value: 25 },
  ];
}

export default Reports;
