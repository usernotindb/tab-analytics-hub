
import { ReportType } from '../types';

export const getValueLabel = (reportType: ReportType): string => {
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

export const getReportTitle = (reportType: ReportType): string => {
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

export const getReportDescription = (reportType: ReportType): string => {
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
