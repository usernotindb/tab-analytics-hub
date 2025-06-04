
import { useState, useEffect } from "react";
import { 
  fetchAllBankApplications, 
  fetchBankApplicationsByStatus, 
  createBankApplication, 
  updateBankApplication, 
  deleteBankApplication,
  BankApplication,
  BankApplicationData 
} from "@/utils/database/bankApplicationOperations";
import { isDatabaseConfigured } from "@/utils/database/dbConnector";

// Sample data for demo mode
const sampleSubmittedApplications: BankApplication[] = [
  {
    id: 1,
    customerId: 1,
    applicationId: "BA-2023-001",
    userId: "14545807",
    customerName: "Azteca Tax Systems",
    bankName: "First National Bank",
    applicationStatus: 'submitted',
    submissionDate: "2023-01-20",
    product: "Business Loan",
    amount: 50000,
    purpose: "Equipment purchase",
    createdAt: "2023-01-15",
    updatedAt: "2023-01-20"
  },
  {
    id: 2,
    customerId: 2,
    applicationId: "BA-2023-002",
    userId: "14545808",
    customerName: "Global Tax Solutions",
    bankName: "Citizens Bank",
    applicationStatus: 'submitted',
    submissionDate: "2023-02-15",
    product: "Line of Credit",
    amount: 75000,
    purpose: "Working capital",
    createdAt: "2023-02-10",
    updatedAt: "2023-02-15"
  }
];

const sampleUnsubmittedApplications: BankApplication[] = [
  {
    id: 3,
    customerId: 3,
    applicationId: "DRAFT-2023-001",
    userId: "14545809",
    customerName: "Premier Tax Services",
    bankName: "First National Bank",
    applicationStatus: 'unsubmitted',
    product: "Business Loan",
    amount: 30000,
    purpose: "Office expansion",
    createdAt: "2023-04-01",
    updatedAt: "2023-04-05"
  }
];

export const useBankApplications = () => {
  const [applications, setApplications] = useState<BankApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    if (!isDatabaseConfigured()) {
      console.log("Database not configured, using sample data");
      setApplications([...sampleSubmittedApplications, ...sampleUnsubmittedApplications]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchAllBankApplications();
      
      if (result.success && result.data) {
        setApplications(result.data);
      } else {
        setError(result.message || "Failed to fetch bank applications");
        setApplications([...sampleSubmittedApplications, ...sampleUnsubmittedApplications]);
      }
    } catch (err) {
      console.error("Error loading bank applications:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setApplications([...sampleSubmittedApplications, ...sampleUnsubmittedApplications]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplicationsByStatus = async (status: 'submitted' | 'unsubmitted') => {
    if (!isDatabaseConfigured()) {
      const filtered = status === 'submitted' ? sampleSubmittedApplications : sampleUnsubmittedApplications;
      setApplications(filtered);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchBankApplicationsByStatus(status);
      
      if (result.success && result.data) {
        setApplications(result.data);
      } else {
        setError(result.message || `Failed to fetch ${status} applications`);
        const filtered = status === 'submitted' ? sampleSubmittedApplications : sampleUnsubmittedApplications;
        setApplications(filtered);
      }
    } catch (err) {
      console.error(`Error loading ${status} applications:`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
      const filtered = status === 'submitted' ? sampleSubmittedApplications : sampleUnsubmittedApplications;
      setApplications(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const addApplication = async (applicationData: BankApplicationData) => {
    if (!isDatabaseConfigured()) {
      const newApplication: BankApplication = {
        id: applications.length + 1,
        customerId: applicationData.customerId,
        applicationId: `${applicationData.applicationStatus === 'unsubmitted' ? 'DRAFT' : 'BA'}-${new Date().getFullYear()}-${String(applications.length + 1).padStart(3, '0')}`,
        userId: `1454${Math.floor(Math.random() * 10000)}`,
        customerName: "Demo Customer",
        bankName: applicationData.bankName,
        applicationStatus: applicationData.applicationStatus,
        submissionDate: applicationData.submissionDate,
        amount: applicationData.amount,
        purpose: applicationData.purpose,
        product: applicationData.product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setApplications(prev => [...prev, newApplication]);
      return { success: true };
    }

    try {
      const result = await createBankApplication(applicationData);
      if (result.success) {
        await loadApplications();
      }
      return result;
    } catch (error) {
      console.error("Error adding bank application:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add application"
      };
    }
  };

  const updateApplication = async (id: number, applicationData: Partial<BankApplicationData>) => {
    if (!isDatabaseConfigured()) {
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, ...applicationData, updatedAt: new Date().toISOString() } : app
      ));
      return { success: true };
    }

    try {
      const result = await updateBankApplication(id, applicationData);
      if (result.success) {
        await loadApplications();
      }
      return result;
    } catch (error) {
      console.error("Error updating bank application:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update application"
      };
    }
  };

  const removeApplication = async (id: number) => {
    if (!isDatabaseConfigured()) {
      setApplications(prev => prev.filter(app => app.id !== id));
      return { success: true };
    }

    try {
      const result = await deleteBankApplication(id);
      if (result.success) {
        await loadApplications();
      }
      return result;
    } catch (error) {
      console.error("Error removing bank application:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to remove application"
      };
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return {
    applications,
    isLoading,
    error,
    loadApplications,
    loadApplicationsByStatus,
    addApplication,
    updateApplication,
    removeApplication,
    isDatabaseMode: isDatabaseConfigured()
  };
};
