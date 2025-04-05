
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  ReportParameters,
  ReportHeader,
  ReportVisualization,
  ReportTable,
  getMockCustomerData,
  getMockRevenueData,
  getMockPortalData,
  getMockApplicationData
} from "@/features/reports";
import { ReportType, ChartType, ReportDataItem } from "@/features/reports/types";

const Reports = () => {
  const [reportType, setReportType] = useState<ReportType>("customer");
  const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(2025, 0, 1), to: new Date() });
  const [selectedChart, setSelectedChart] = useState<ChartType>("bar");
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };
  
  const { data: reportData = [], isLoading } = useQuery<ReportDataItem[]>({
    queryKey: ['reports', reportType, dateRange],
    queryFn: async () => {
      try {
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ReportHeader reportType={reportType} onExportReport={handleExportReport} />
      
      <ReportParameters 
        reportType={reportType}
        setReportType={setReportType}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Report Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pt-4">
            <ReportVisualization 
              reportData={reportData}
              isLoading={isLoading}
              selectedChart={selectedChart}
              reportType={reportType}
            />
          </div>
        </CardContent>
      </Card>
      
      <ReportTable
        reportData={reportData}
        isLoading={isLoading}
        reportType={reportType}
      />
    </div>
  );
}

export default Reports;
