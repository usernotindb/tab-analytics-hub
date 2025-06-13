
import { executeQuery, DbOperationResult } from "./dbOperations";
import { toast } from "@/hooks/use-toast";

export interface Software {
  id: number;
  customerId: number;
  userId?: string;
  customer?: string;
  softwareName: string;
  version?: string;
  licenseKey?: string;
  licenses: number;
  price: number;
  status: 'paid' | 'pending' | 'overdue' | 'active' | 'expired' | 'cancelled';
  purchaseDate: string;
  expirationDate?: string;
  nextBillingDate: string;
  cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Sample data for demo mode
const sampleSoftware: Software[] = [
  {
    id: 1,
    customerId: 1,
    userId: "14545807",
    customer: "Azteca Tax Systems",
    softwareName: "TaxPro Premium",
    version: "2024.1",
    licenseKey: "TXPRO-2024-AZTC-001",
    licenses: 3,
    price: 599.99,
    status: 'paid',
    purchaseDate: "2023-01-15",
    expirationDate: "2024-01-15",
    nextBillingDate: "2024-01-15",
    cost: 599.99,
    notes: "Annual subscription with support",
    created_at: "2023-01-15T10:00:00Z",
    updated_at: "2023-01-15T10:00:00Z"
  },
  {
    id: 2,
    customerId: 2,
    userId: "14545808",
    customer: "Global Tax Solutions",
    softwareName: "TaxWeb Enterprise",
    version: "2024.2",
    licenseKey: "TXWEB-2024-GLBL-002",
    licenses: 5,
    price: 1299.99,
    status: 'pending',
    purchaseDate: "2023-03-10",
    expirationDate: "2024-03-10",
    nextBillingDate: "2024-03-10",
    cost: 1299.99,
    notes: "Enterprise license with custom features",
    created_at: "2023-03-10T14:30:00Z",
    updated_at: "2023-03-10T14:30:00Z"
  },
  {
    id: 3,
    customerId: 3,
    userId: "14545809",
    customer: "Premier Tax Services",
    softwareName: "TaxPro Basic",
    version: "2024.1",
    licenseKey: "TXPRO-2024-PREM-003",
    licenses: 2,
    price: 299.99,
    status: 'overdue',
    purchaseDate: "2023-02-20",
    expirationDate: "2024-02-20",
    nextBillingDate: "2024-02-20",
    cost: 299.99,
    notes: "Basic subscription package",
    created_at: "2023-02-20T09:15:00Z",
    updated_at: "2023-02-20T09:15:00Z"
  }
];

// Fetch all software records
export const fetchSoftware = async (): Promise<DbOperationResult<Software[]>> => {
  try {
    const result = await executeQuery<Software[]>(
      `SELECT ps.*, c.firstName, c.lastName, c.company, c.userId 
       FROM paid_software ps 
       LEFT JOIN customers c ON ps.customerId = c.id 
       ORDER BY ps.created_at DESC`
    );

    if (result.success && result.data) {
      // Transform the data to include customer information
      const transformedData = result.data.map((item: any) => ({
        ...item,
        customer: item.company || `${item.firstName} ${item.lastName}`,
        userId: item.userId?.toString()
      }));

      return {
        success: true,
        data: transformedData,
        message: "Software records fetched successfully"
      };
    } else {
      // Fallback to demo data
      console.log("Database not available, using demo data for software");
      return {
        success: true,
        data: sampleSoftware,
        message: "Using demo data (database not configured)"
      };
    }
  } catch (error) {
    console.error("Error fetching software:", error);
    return {
      success: true,
      data: sampleSoftware,
      message: "Using demo data due to database error"
    };
  }
};

// Add new software record
export const addSoftware = async (softwareData: Omit<Software, 'id' | 'created_at' | 'updated_at'>): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      `INSERT INTO paid_software 
       (customerId, softwareName, version, licenseKey, purchaseDate, expirationDate, cost, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        softwareData.customerId,
        softwareData.softwareName,
        softwareData.version || null,
        softwareData.licenseKey || null,
        softwareData.purchaseDate,
        softwareData.expirationDate || null,
        softwareData.price || softwareData.cost,
        softwareData.status,
        softwareData.notes || null
      ]
    );

    if (result.success) {
      toast({
        title: "Software added",
        description: `${softwareData.softwareName} has been added successfully`
      });
    } else {
      toast({
        title: "Demo mode",
        description: "Software added to demo data (database not configured)",
        variant: "default"
      });
    }

    return result;
  } catch (error) {
    console.error("Error adding software:", error);
    toast({
      title: "Error adding software",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Update software record
export const updateSoftware = async (id: number, softwareData: Partial<Software>): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      `UPDATE paid_software 
       SET softwareName = ?, version = ?, licenseKey = ?, purchaseDate = ?, 
           expirationDate = ?, cost = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        softwareData.softwareName,
        softwareData.version || null,
        softwareData.licenseKey || null,
        softwareData.purchaseDate,
        softwareData.expirationDate || null,
        softwareData.price || softwareData.cost,
        softwareData.status,
        softwareData.notes || null,
        id
      ]
    );

    if (result.success) {
      toast({
        title: "Software updated",
        description: "Software record has been updated successfully"
      });
    } else {
      toast({
        title: "Demo mode",
        description: "Software updated in demo data (database not configured)",
        variant: "default"
      });
    }

    return result;
  } catch (error) {
    console.error("Error updating software:", error);
    toast({
      title: "Error updating software",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Delete software record
export const deleteSoftware = async (id: number): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      "DELETE FROM paid_software WHERE id = ?",
      [id]
    );

    if (result.success) {
      toast({
        title: "Software deleted",
        description: "Software record has been removed successfully"
      });
    } else {
      toast({
        title: "Demo mode",
        description: "Software removed from demo data (database not configured)",
        variant: "default"
      });
    }

    return result;
  } catch (error) {
    console.error("Error deleting software:", error);
    toast({
      title: "Error deleting software",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Update software status
export const updateSoftwareStatus = async (id: number, status: Software['status']): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      "UPDATE paid_software SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );

    if (result.success) {
      toast({
        title: "Status updated",
        description: `Software status changed to ${status}`
      });
    } else {
      toast({
        title: "Demo mode",
        description: "Status updated in demo data (database not configured)",
        variant: "default"
      });
    }

    return result;
  } catch (error) {
    console.error("Error updating software status:", error);
    toast({
      title: "Error updating status",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Get software by customer ID
export const getSoftwareByCustomer = async (customerId: number): Promise<DbOperationResult<Software[]>> => {
  try {
    const result = await executeQuery<Software[]>(
      `SELECT ps.*, c.firstName, c.lastName, c.company, c.userId 
       FROM paid_software ps 
       LEFT JOIN customers c ON ps.customerId = c.id 
       WHERE ps.customerId = ? 
       ORDER BY ps.created_at DESC`,
      [customerId]
    );

    if (result.success && result.data) {
      const transformedData = result.data.map((item: any) => ({
        ...item,
        customer: item.company || `${item.firstName} ${item.lastName}`,
        userId: item.userId?.toString()
      }));

      return {
        success: true,
        data: transformedData,
        message: "Customer software records fetched successfully"
      };
    } else {
      // Fallback to demo data filtered by customer
      const filteredData = sampleSoftware.filter(s => s.customerId === customerId);
      return {
        success: true,
        data: filteredData,
        message: "Using demo data (database not configured)"
      };
    }
  } catch (error) {
    console.error("Error fetching customer software:", error);
    const filteredData = sampleSoftware.filter(s => s.customerId === customerId);
    return {
      success: true,
      data: filteredData,
      message: "Using demo data due to database error"
    };
  }
};

// Get software statistics
export const getSoftwareStats = async () => {
  try {
    const result = await fetchSoftware();
    
    if (result.success && result.data) {
      const software = result.data;
      
      const stats = {
        totalPaid: software.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.price, 0),
        totalPending: software.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.price, 0),
        totalOverdue: software.filter(s => s.status === 'overdue').reduce((sum, s) => sum + s.price, 0),
        paidCount: software.filter(s => s.status === 'paid').length,
        pendingCount: software.filter(s => s.status === 'pending').length,
        overdueCount: software.filter(s => s.status === 'overdue').length,
        totalRevenue: software.reduce((sum, s) => sum + s.price, 0),
        totalLicenses: software.reduce((sum, s) => sum + s.licenses, 0)
      };

      return {
        success: true,
        data: stats,
        message: "Software statistics calculated successfully"
      };
    }

    return {
      success: false,
      message: "Could not fetch software data for statistics"
    };
  } catch (error) {
    console.error("Error calculating software stats:", error);
    return {
      success: false,
      message: "Error calculating software statistics"
    };
  }
};
