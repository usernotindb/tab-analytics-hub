
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { ReportParametersProps } from "../types";

export const ReportParameters = ({
  reportType,
  setReportType,
  dateRange,
  onDateRangeChange,
  selectedChart,
  setSelectedChart
}: ReportParametersProps) => {
  return (
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
            <Select value={reportType} onValueChange={(value) => setReportType(value as any)}>
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
            <DatePickerWithRange date={dateRange} setDate={onDateRangeChange} />
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
  );
};
