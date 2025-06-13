
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchSoftware, 
  addSoftware, 
  updateSoftware, 
  deleteSoftware,
  updateSoftwareStatus,
  getSoftwareByCustomer,
  getSoftwareStats,
  Software 
} from "@/utils/database/softwareOperations";
import { useDatabase } from "./use-database";

export const useSoftware = () => {
  const queryClient = useQueryClient();
  const { isConfigured } = useDatabase();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all software
  const { 
    data: software = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['software'],
    queryFn: async () => {
      const result = await fetchSoftware();
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch software statistics
  const { 
    data: stats,
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['software-stats'],
    queryFn: async () => {
      const result = await getSoftwareStats();
      return result.data || {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        paidCount: 0,
        pendingCount: 0,
        overdueCount: 0,
        totalRevenue: 0,
        totalLicenses: 0
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  // Add software mutation
  const addSoftwareMutation = useMutation({
    mutationFn: addSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software'] });
      queryClient.invalidateQueries({ queryKey: ['software-stats'] });
    },
  });

  // Update software mutation
  const updateSoftwareMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Software> }) => 
      updateSoftware(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software'] });
      queryClient.invalidateQueries({ queryKey: ['software-stats'] });
    },
  });

  // Delete software mutation
  const deleteSoftwareMutation = useMutation({
    mutationFn: deleteSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software'] });
      queryClient.invalidateQueries({ queryKey: ['software-stats'] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Software['status'] }) => 
      updateSoftwareStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['software'] });
      queryClient.invalidateQueries({ queryKey: ['software-stats'] });
    },
  });

  // Filter software based on search term
  const filteredSoftware = software.filter((item) => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      item.userId?.toLowerCase().includes(searchTermLower) ||
      item.customer?.toLowerCase().includes(searchTermLower) ||
      item.softwareName.toLowerCase().includes(searchTermLower) ||
      item.status.toLowerCase().includes(searchTermLower)
    );
  });

  // Helper functions
  const addSoftwareRecord = async (softwareData: Omit<Software, 'id' | 'created_at' | 'updated_at'>) => {
    return addSoftwareMutation.mutateAsync(softwareData);
  };

  const updateSoftwareRecord = async (id: number, data: Partial<Software>) => {
    return updateSoftwareMutation.mutateAsync({ id, data });
  };

  const deleteSoftwareRecord = async (id: number) => {
    return deleteSoftwareMutation.mutateAsync(id);
  };

  const updateSoftwareStatusRecord = async (id: number, status: Software['status']) => {
    return updateStatusMutation.mutateAsync({ id, status });
  };

  const refreshData = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['software-stats'] });
  };

  return {
    // Data
    software: filteredSoftware,
    allSoftware: software,
    stats,
    
    // Loading states
    isLoading,
    statsLoading,
    isAddingLoading: addSoftwareMutation.isPending,
    isUpdatingLoading: updateSoftwareMutation.isPending,
    isDeletingLoading: deleteSoftwareMutation.isPending,
    isStatusUpdateLoading: updateStatusMutation.isPending,
    
    // Error states
    error,
    addError: addSoftwareMutation.error,
    updateError: updateSoftwareMutation.error,
    deleteError: deleteSoftwareMutation.error,
    
    // Actions
    addSoftwareRecord,
    updateSoftwareRecord,
    deleteSoftwareRecord,
    updateSoftwareStatusRecord,
    refreshData,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Database status
    isConfigured,
    
    // Helper function to get software by customer
    getSoftwareByCustomer: (customerId: number) => {
      return useQuery({
        queryKey: ['software', 'customer', customerId],
        queryFn: async () => {
          const result = await getSoftwareByCustomer(customerId);
          return result.data || [];
        },
        enabled: !!customerId,
      });
    }
  };
};

// Hook for customer-specific software
export const useCustomerSoftware = (customerId: number) => {
  const { data: software = [], isLoading, error } = useQuery({
    queryKey: ['software', 'customer', customerId],
    queryFn: async () => {
      const result = await getSoftwareByCustomer(customerId);
      return result.data || [];
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    software,
    isLoading,
    error
  };
};
