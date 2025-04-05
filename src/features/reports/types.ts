
import { DateRange } from "react-day-picker";

export interface ReportDataItem {
  name: string;
  value: number;
  change?: string;
}

export type ReportType = "customer" | "revenue" | "portal" | "application";
export type ChartType = "bar" | "line" | "pie";

export interface ReportParametersProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedChart: ChartType;
  setSelectedChart: (value: ChartType) => void;
}

export interface ReportVisualizationProps {
  reportData: ReportDataItem[];
  isLoading: boolean;
  selectedChart: ChartType;
  reportType: ReportType;
}

export interface ReportTableProps {
  reportData: ReportDataItem[];
  isLoading: boolean;
  reportType: ReportType;
}

export interface ReportHeaderProps {
  reportType: ReportType;
  onExportReport: () => void;
}
