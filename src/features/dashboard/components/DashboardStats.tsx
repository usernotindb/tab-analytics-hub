
import { Users, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "./StatCard";
import { DashboardData } from "../types";
import { calculatePercentChange, formatPercentChange } from "../utils/dashboardHelpers";

interface DashboardStatsProps {
  dashboardData: DashboardData;
}

export const DashboardStats = ({ dashboardData }: DashboardStatsProps) => {
  const { customers, portals, payments, isLoading } = dashboardData;
  
  // Calculate real status counts
  const readyPortals = portals.filter(p => p.installed).length;
  const notReadyPortals = portals.filter(p => !p.installed).length;
  const paidSoftware = payments.filter(p => p.status === 'paid').length;

  // Calculate stats
  const totalCustomers = customers.length;
  const percentChangeCustomers = calculatePercentChange(totalCustomers, 145); // Hardcoded for now
  
  const percentChangePortalsReady = calculatePercentChange(readyPortals, 72);
  const percentChangePortalsNotReady = calculatePercentChange(notReadyPortals, 33);
  const percentChangePaidSoftware = calculatePercentChange(paidSoftware, 98);

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString() || "145",
      change: formatPercentChange(percentChangeCustomers),
      trend: percentChangeCustomers >= 0 ? "up" : "down",
      icon: Users,
      color: "bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-300"
    },
    {
      title: "Portals Ready",
      value: readyPortals.toString() || "72",
      change: formatPercentChange(percentChangePortalsReady),
      trend: percentChangePortalsReady >= 0 ? "up" : "down",
      icon: CheckCircle,
      color: "bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-300"
    },
    {
      title: "Portals Not Ready",
      value: notReadyPortals.toString() || "33",
      change: formatPercentChange(percentChangePortalsNotReady),
      trend: percentChangePortalsNotReady >= 0 ? "up" : "down",
      icon: XCircle,
      color: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300"
    },
    {
      title: "Paid Software",
      value: paidSoftware.toString() || "98",
      change: formatPercentChange(percentChangePaidSoftware),
      trend: percentChangePaidSoftware >= 0 ? "up" : "down",
      icon: CreditCard,
      color: "bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-300"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.title} 
          {...stat} 
          isLoading={isLoading}
          // Add animation delay based on index
          // This is handled in CSS with the animate-slide-in class now
        />
      ))}
    </div>
  );
};
