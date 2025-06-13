
import { useQuery } from "@tanstack/react-query";
import { 
  getDashboardStats, 
  getPortalStatusDistribution, 
  getBankApplicationTrends,
  getDemoStats,
  getDemoPortalDistribution,
  getDemoBankAppTrends,
  DashboardStats,
  ChartData
} from "@/utils/dashboard/dashboardAnalytics";
import { useDatabase } from "./use-database";

export const useDashboard = () => {
  const { isConfigured } = useDatabase();

  // Dashboard statistics
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      if (!isConfigured) {
        console.log("Database not configured, using demo stats");
        return getDemoStats();
      }
      
      const result = await getDashboardStats();
      if (result.success && result.data) {
        return result.data;
      }
      
      console.log("Database query failed, falling back to demo data");
      return getDemoStats();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });

  // Portal status distribution for chart
  const { 
    data: portalDistribution, 
    isLoading: portalLoading,
    error: portalError
  } = useQuery({
    queryKey: ['portal-distribution'],
    queryFn: async (): Promise<ChartData[]> => {
      if (!isConfigured) {
        return getDemoPortalDistribution();
      }
      
      const result = await getPortalStatusDistribution();
      if (result.success && result.data) {
        return result.data;
      }
      
      return getDemoPortalDistribution();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Bank application trends for chart
  const { 
    data: bankAppTrends, 
    isLoading: bankAppLoading,
    error: bankAppError
  } = useQuery({
    queryKey: ['bank-app-trends'],
    queryFn: async (): Promise<ChartData[]> => {
      if (!isConfigured) {
        return getDemoBankAppTrends();
      }
      
      const result = await getBankApplicationTrends();
      if (result.success && result.data) {
        return result.data;
      }
      
      return getDemoBankAppTrends();
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    // Data
    stats: stats || getDemoStats(),
    portalDistribution: portalDistribution || getDemoPortalDistribution(),
    bankAppTrends: bankAppTrends || getDemoBankAppTrends(),
    
    // Loading states
    isLoading: statsLoading || portalLoading || bankAppLoading,
    statsLoading,
    portalLoading,
    bankAppLoading,
    
    // Error states
    error: statsError || portalError || bankAppError,
    statsError,
    portalError,
    bankAppError,
    
    // Actions
    refreshData: () => {
      refetchStats();
    },
    
    // Database status
    isConfigured,
    isDemoMode: !isConfigured
  };
};
