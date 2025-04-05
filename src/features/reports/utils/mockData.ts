
import { ReportDataItem } from '../types';

export function getMockCustomerData(): ReportDataItem[] {
  return [
    { name: "Jan", value: 42, change: "+5.0%" },
    { name: "Feb", value: 57, change: "+35.7%" },
    { name: "Mar", value: 72, change: "+26.3%" },
    { name: "Apr", value: 87, change: "+20.8%" },
    { name: "May", value: 103, change: "+18.4%" },
    { name: "Jun", value: 118, change: "+14.6%" },
  ];
}

export function getMockRevenueData(): ReportDataItem[] {
  return [
    { name: "CRM Software", value: 45000 },
    { name: "Accounting", value: 32000 },
    { name: "Inventory", value: 28000 },
    { name: "Banking Apps", value: 18000 },
    { name: "Merchant Services", value: 15000 },
  ];
}

export function getMockPortalData(): ReportDataItem[] {
  return [
    { name: "Ready", value: 75 },
    { name: "Not Ready", value: 35 },
    { name: "Installation Pending", value: 18 },
    { name: "Maintenance", value: 12 },
  ];
}

export function getMockApplicationData(): ReportDataItem[] {
  return [
    { name: "Submitted", value: 62 },
    { name: "Processing", value: 35 },
    { name: "Approved", value: 48 },
    { name: "Rejected", value: 16 },
    { name: "Unsubmitted", value: 25 },
  ];
}
