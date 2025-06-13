
import { Customer } from "@/types/customer";
import { Portal } from "@/utils/database/portalOperations";

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  includeHeaders?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const exportCustomersToCSV = (customers: Customer[]): string => {
  const headers = ['ID', 'User ID', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Address', 'Created Date'];
  const csvContent = [
    headers.join(','),
    ...customers.map(customer => [
      customer.id,
      customer.userId,
      customer.firstName,
      customer.lastName,
      customer.company,
      customer.email,
      customer.phone,
      `"${customer.address}"`,
      customer.createdDate
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const exportPortalsToCSV = (portals: Portal[]): string => {
  const headers = ['ID', 'Customer ID', 'Portal Name', 'Portal URL', 'Status', 'Last Checked', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...portals.map(portal => [
      portal.id,
      portal.customerId,
      portal.portalName,
      portal.portalUrl,
      portal.status,
      portal.lastChecked,
      portal.createdAt
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const exportToCSV = (data: any[], filename: string, exportFunction: (data: any[]) => string) => {
  const csvContent = exportFunction(data);
  downloadFile(csvContent, filename, 'text/csv');
};
