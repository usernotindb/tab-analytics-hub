
import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { fetchAllCustomers, createCustomer, updateCustomer, deleteCustomer, CustomerData } from "@/utils/database/customerOperations";
import { isDatabaseConfigured } from "@/utils/database/dbConnector";
import { sampleCustomers } from "@/data/sampleCustomers";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    if (!isDatabaseConfigured()) {
      console.log("Database not configured, using sample data");
      setCustomers(sampleCustomers);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchAllCustomers();
      
      if (result.success && result.data) {
        setCustomers(result.data);
      } else {
        setError(result.message || "Failed to fetch customers");
        // Fallback to sample data if database fetch fails
        setCustomers(sampleCustomers);
      }
    } catch (err) {
      console.error("Error loading customers:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Fallback to sample data on error
      setCustomers(sampleCustomers);
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomer = async (customerData: CustomerData) => {
    if (!isDatabaseConfigured()) {
      // Create mock customer for demo mode
      const newCustomer: Customer = {
        id: customers.length + 1,
        userId: `1454${Math.floor(Math.random() * 10000)}`,
        efin: customerData.efin || "",
        company: customerData.company || "",
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        email: customerData.email || "",
        businessPhone: customerData.businessPhone || "",
        cellPhone: customerData.cellPhone || "",
        portalReady: false,
        bankAppSubmitted: false,
        softwarePaid: false,
      };
      
      setCustomers(prev => [...prev, newCustomer]);
      return { success: true };
    }

    try {
      const result = await createCustomer(customerData);
      if (result.success) {
        await loadCustomers(); // Refresh the list
      }
      return result;
    } catch (error) {
      console.error("Error adding customer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add customer"
      };
    }
  };

  const removeCustomer = async (id: number) => {
    if (!isDatabaseConfigured()) {
      // Remove from local state for demo mode
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      return { success: true };
    }

    try {
      const result = await deleteCustomer(id);
      if (result.success) {
        await loadCustomers(); // Refresh the list
      }
      return result;
    } catch (error) {
      console.error("Error removing customer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to remove customer"
      };
    }
  };

  const editCustomer = async (id: number, customerData: Partial<CustomerData>) => {
    if (!isDatabaseConfigured()) {
      // Update local state for demo mode
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...customerData } : customer
      ));
      return { success: true };
    }

    try {
      const result = await updateCustomer(id, customerData);
      if (result.success) {
        await loadCustomers(); // Refresh the list
      }
      return result;
    } catch (error) {
      console.error("Error updating customer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update customer"
      };
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    isLoading,
    error,
    loadCustomers,
    addCustomer,
    removeCustomer,
    editCustomer,
    isDatabaseMode: isDatabaseConfigured()
  };
};
