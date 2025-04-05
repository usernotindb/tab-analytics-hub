
import { CustomerGrowthChart } from "./CustomerGrowthChart";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { DashboardData } from "../types";
import { processCustomerGrowth } from "../utils/dashboardHelpers";

interface DashboardChartsProps {
  dashboardData: DashboardData;
}

export const DashboardCharts = ({ dashboardData }: DashboardChartsProps) => {
  const { customers, portals, payments, applications, isLoading } = dashboardData;

  // Process data for charts
  const customerData = customers.length > 0 
    ? processCustomerGrowth(customers)
    : [
        { month: 'Jan', customers: 40 },
        { month: 'Feb', customers: 55 },
        { month: 'Mar', customers: 70 },
        { month: 'Apr', customers: 85 },
        { month: 'May', customers: 100 },
        { month: 'Jun', customers: 115 },
      ];

  // Calculate status counts for the chart
  const readyPortals = portals.filter(p => p.installed).length;
  const notReadyPortals = portals.filter(p => !p.installed).length;
  const paidSoftware = payments.filter(p => p.status === 'paid').length;
  const submittedApps = applications.filter(a => a.status === 'submitted').length;
  const unsubmittedApps = applications.filter(a => a.status === 'unsubmitted').length;

  const statusData = [
    { name: 'Portal Ready', value: readyPortals || 25, color: '#4ade80' },
    { name: 'Portal Not Ready', value: notReadyPortals || 15, color: '#f87171' },
    { name: 'Bank App Submitted', value: submittedApps || 30, color: '#60a5fa' },
    { name: 'Bank App Unsubmitted', value: unsubmittedApps || 10, color: '#fbbf24' },
    { name: 'Paid Software', value: paidSoftware || 20, color: '#a78bfa' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CustomerGrowthChart 
        data={customerData} 
        isLoading={isLoading} 
        title="Customer Growth"
      />
      <StatusDistributionChart 
        data={statusData} 
        isLoading={isLoading} 
        title="Status Distribution"
      />
    </div>
  );
};
