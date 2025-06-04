
import { useState, useEffect } from "react";
import { fetchAllPortals, fetchPortalsByStatus, createPortal, updatePortalStatus, deletePortal, Portal } from "@/utils/database/portalOperations";
import { isDatabaseConfigured } from "@/utils/database/dbConnector";

// Sample data for demo mode
const samplePortals: Portal[] = [
  {
    id: 1,
    customerId: 1,
    userId: "14545807",
    company: "Azteca Tax Systems",
    portalName: "Xlink",
    software: "Xlink",
    type: "Desktop",
    userType: "Master User",
    installed: true,
    license: "1040 License",
    installedBy: "John Doe",
    status: "ready",
    createdAt: "2023-01-15",
    updatedAt: "2023-02-10",
  },
  {
    id: 2,
    customerId: 2,
    userId: "14545808",
    company: "Global Tax Solutions",
    portalName: "TaxWeb",
    software: "TaxWeb",
    type: "Online",
    userType: "Admin",
    installed: true,
    license: "Full Service",
    installedBy: "Jane Smith",
    status: "ready",
    createdAt: "2023-03-05",
    updatedAt: "2023-03-20",
  },
  {
    id: 3,
    customerId: 3,
    userId: "14545809",
    company: "Premier Tax Services",
    portalName: "TaxPro",
    software: "TaxPro",
    type: "Desktop",
    userType: "Standard User",
    installed: false,
    license: "1040 License",
    installedBy: "N/A",
    status: "not_ready",
    createdAt: "2023-01-25",
    updatedAt: "2023-01-25",
  },
];

export const usePortals = () => {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortals = async () => {
    if (!isDatabaseConfigured()) {
      console.log("Database not configured, using sample data");
      setPortals(samplePortals);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchAllPortals();
      
      if (result.success && result.data) {
        setPortals(result.data);
      } else {
        setError(result.message || "Failed to fetch portals");
        setPortals(samplePortals); // Fallback to sample data
      }
    } catch (err) {
      console.error("Error loading portals:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setPortals(samplePortals); // Fallback to sample data
    } finally {
      setIsLoading(false);
    }
  };

  const loadPortalsByStatus = async (status: 'ready' | 'not_ready' | 'pending' | 'error') => {
    if (!isDatabaseConfigured()) {
      const filtered = samplePortals.filter(portal => portal.status === status);
      setPortals(filtered);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchPortalsByStatus(status);
      
      if (result.success && result.data) {
        setPortals(result.data);
      } else {
        setError(result.message || `Failed to fetch ${status} portals`);
        const filtered = samplePortals.filter(portal => portal.status === status);
        setPortals(filtered);
      }
    } catch (err) {
      console.error(`Error loading ${status} portals:`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
      const filtered = samplePortals.filter(portal => portal.status === status);
      setPortals(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const addPortal = async (portalData: {
    customerId: number;
    portalName: string;
    portalUrl?: string;
    status?: 'ready' | 'not_ready' | 'pending' | 'error';
  }) => {
    if (!isDatabaseConfigured()) {
      // Create mock portal for demo mode
      const newPortal: Portal = {
        id: portals.length + 1,
        customerId: portalData.customerId,
        portalName: portalData.portalName,
        portalUrl: portalData.portalUrl || "",
        software: portalData.portalName,
        type: "Desktop",
        userType: "Standard User",
        installed: portalData.status === "ready",
        license: "",
        installedBy: "Current User",
        status: portalData.status || "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setPortals(prev => [...prev, newPortal]);
      return { success: true };
    }

    try {
      const result = await createPortal(portalData);
      if (result.success) {
        await loadPortals(); // Refresh the list
      }
      return result;
    } catch (error) {
      console.error("Error adding portal:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add portal"
      };
    }
  };

  const updateStatus = async (id: number, status: 'ready' | 'not_ready' | 'pending' | 'error', errorMessage?: string) => {
    if (!isDatabaseConfigured()) {
      // Update local state for demo mode
      setPortals(prev => prev.map(portal => 
        portal.id === id ? { ...portal, status, errorMessage, updatedAt: new Date().toISOString() } : portal
      ));
      return { success: true };
    }

    try {
      const result = await updatePortalStatus(id, status, errorMessage);
      if (result.success) {
        await loadPortals(); // Refresh the list
      }
      return result;
    } catch (error) {
      console.error("Error updating portal status:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update portal status"
      };
    }
  };

  const removePortal = async (id: number) => {
    if (!isDatabaseConfigured()) {
      // Remove from local state for demo mode
      setPortals(prev => prev.filter(portal => portal.id !== id));
      return { success: true };
    }

    try {
      const result = await deletePortal(id);
      if (result.success) {
        await loadPortals(); // Refresh the list
      }
      return result;
    } catch (error) {
      console.error("Error removing portal:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to remove portal"
      };
    }
  };

  useEffect(() => {
    loadPortals();
  }, []);

  return {
    portals,
    isLoading,
    error,
    loadPortals,
    loadPortalsByStatus,
    addPortal,
    updateStatus,
    removePortal,
    isDatabaseMode: isDatabaseConfigured()
  };
};
