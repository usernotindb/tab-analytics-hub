
import { useState, useEffect } from "react";
import { DashboardStats, DashboardCharts, useDashboardData } from "@/features/dashboard";

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const dashboardData = useDashboardData();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on server to avoid hydration errors
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <DashboardStats dashboardData={dashboardData} />
      
      <DashboardCharts dashboardData={dashboardData} />
    </div>
  );
};

export default Dashboard;
