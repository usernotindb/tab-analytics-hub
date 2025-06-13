
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Database } from "lucide-react";
import { exportToCSV, exportToJSON, exportCustomersToCSV, exportPortalsToCSV } from "@/utils/export/dataExporter";
import { Customer } from "@/types/customer";
import { Portal } from "@/utils/database/portalOperations";

interface ExportButtonProps {
  data: Customer[] | Portal[] | any[];
  filename: string;
  type: 'customers' | 'portals' | 'generic';
}

export const ExportButton = ({ data, filename, type }: ExportButtonProps) => {
  const handleExportCSV = () => {
    if (type === 'customers') {
      exportToCSV(data as Customer[], `${filename}.csv`, exportCustomersToCSV);
    } else if (type === 'portals') {
      exportToCSV(data as Portal[], `${filename}.csv`, exportPortalsToCSV);
    } else {
      // Generic CSV export for other data types
      const csvContent = data.map(item => Object.values(item).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleExportJSON = () => {
    exportToJSON(data, `${filename}.json`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 z-50">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <Database className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
