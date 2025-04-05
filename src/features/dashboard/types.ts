
import { Customer, Portal, SoftwarePayment, BankApplication } from "@/lib/schema";

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
  isLoading: boolean;
}

export interface CustomerDataPoint {
  month: string;
  customers: number;
  year?: number;
}

export interface StatusDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  customers: Customer[];
  portals: Portal[];
  payments: SoftwarePayment[];
  applications: BankApplication[];
  isLoading: boolean;
}

export interface ChartContainerProps {
  title: string;
  isLoading: boolean;
  height?: string;
}
