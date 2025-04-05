
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/apiService";
import { toast } from "sonner";
import { Customer, Portal, SoftwarePayment, BankApplication } from "@/lib/schema";
import { DashboardData } from "../types";

export const useDashboardData = (): DashboardData => {
  // Fetch customers data
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ['dashboard', 'customers'],
    queryFn: async () => {
      try {
        return await apiService.get('/customers');
      } catch (error) {
        toast.error("Failed to load customers data");
        return [];
      }
    },
  });

  // Fetch portals data
  const { data: portals = [], isLoading: isLoadingPortals } = useQuery<Portal[]>({
    queryKey: ['dashboard', 'portals'],
    queryFn: async () => {
      try {
        return await apiService.get('/portals');
      } catch (error) {
        toast.error("Failed to load portals data");
        return [];
      }
    },
  });

  // Fetch software payments data
  const { data: payments = [], isLoading: isLoadingSoftware } = useQuery<SoftwarePayment[]>({
    queryKey: ['dashboard', 'software-payments'],
    queryFn: async () => {
      try {
        return await apiService.get('/software-payments');
      } catch (error) {
        toast.error("Failed to load software payments data");
        return [];
      }
    },
  });

  // Fetch bank applications data
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<BankApplication[]>({
    queryKey: ['dashboard', 'bank-applications'],
    queryFn: async () => {
      try {
        return await apiService.get('/bank-applications');
      } catch (error) {
        toast.error("Failed to load bank applications data");
        return [];
      }
    },
  });

  const isLoading = isLoadingCustomers || isLoadingPortals || isLoadingSoftware || isLoadingApplications;

  return {
    customers,
    portals,
    payments,
    applications,
    isLoading
  };
};
