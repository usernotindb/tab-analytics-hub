
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ReportHeaderProps } from "../types";
import { getReportTitle, getReportDescription } from "../utils/reportHelpers";

export const ReportHeader = ({ reportType, onExportReport }: ReportHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getReportTitle(reportType)}</h1>
        <p className="text-muted-foreground">{getReportDescription(reportType)}</p>
      </div>
      <Button onClick={onExportReport}>
        <Download className="h-4 w-4 mr-2" />
        Export Report
      </Button>
    </div>
  );
};
