
import { executeQuery, DbOperationResult } from "./dbOperations";
import { toast } from "@/hooks/use-toast";

export interface BankApplication {
  id: number;
  customerId: number;
  portalId?: number;
  applicationId?: string;
  userId?: string;
  customerName?: string;
  bankName: string;
  applicationStatus: 'submitted' | 'unsubmitted' | 'approved' | 'denied' | 'pending';
  submissionDate?: string;
  amount?: number;
  purpose?: string;
  product: string;
  documents?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankApplicationData {
  customerId: number;
  portalId?: number;
  applicationId?: string;
  bankName: string;
  applicationStatus: 'submitted' | 'unsubmitted' | 'approved' | 'denied' | 'pending';
  submissionDate?: string;
  amount?: number;
  purpose?: string;
  product: string;
  documents?: any;
}

export const fetchAllBankApplications = async (): Promise<DbOperationResult<BankApplication[]>> => {
  try {
    const result = await executeQuery<any[]>(
      `SELECT ba.*, c.userId, c.company as customerName, c.firstName, c.lastName
       FROM bank_applications ba
       JOIN customers c ON ba.customerId = c.id
       WHERE c.status = 'active'
       ORDER BY ba.created_at DESC`
    );

    if (result.success && result.data) {
      const applications: BankApplication[] = result.data.map((row: any) => ({
        id: row.id,
        customerId: row.customerId,
        portalId: row.portalId,
        applicationId: row.applicationId || `BA-${new Date().getFullYear()}-${String(row.id).padStart(3, '0')}`,
        userId: row.userId || '',
        customerName: row.customerName || `${row.firstName} ${row.lastName}`,
        bankName: row.bankName,
        applicationStatus: row.applicationStatus,
        submissionDate: row.submissionDate,
        amount: row.amount,
        purpose: row.purpose,
        product: row.product || 'Business Loan',
        documents: row.documents ? JSON.parse(row.documents) : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return {
        success: true,
        data: applications,
        message: "Bank applications fetched successfully"
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching bank applications:", error);
    return {
      success: false,
      message: `Error fetching bank applications: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const fetchBankApplicationsByStatus = async (status: 'submitted' | 'unsubmitted'): Promise<DbOperationResult<BankApplication[]>> => {
  try {
    const result = await executeQuery<any[]>(
      `SELECT ba.*, c.userId, c.company as customerName, c.firstName, c.lastName
       FROM bank_applications ba
       JOIN customers c ON ba.customerId = c.id
       WHERE ba.applicationStatus = ? AND c.status = 'active'
       ORDER BY ba.created_at DESC`,
      [status]
    );

    if (result.success && result.data) {
      const applications: BankApplication[] = result.data.map((row: any) => ({
        id: row.id,
        customerId: row.customerId,
        portalId: row.portalId,
        applicationId: row.applicationId || `${status === 'unsubmitted' ? 'DRAFT' : 'BA'}-${new Date().getFullYear()}-${String(row.id).padStart(3, '0')}`,
        userId: row.userId || '',
        customerName: row.customerName || `${row.firstName} ${row.lastName}`,
        bankName: row.bankName,
        applicationStatus: row.applicationStatus,
        submissionDate: row.submissionDate,
        amount: row.amount,
        purpose: row.purpose,
        product: row.product || 'Business Loan',
        documents: row.documents ? JSON.parse(row.documents) : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return {
        success: true,
        data: applications,
        message: `${status} bank applications fetched successfully`
      };
    }

    return result;
  } catch (error) {
    console.error(`Error fetching ${status} bank applications:`, error);
    return {
      success: false,
      message: `Error fetching ${status} bank applications: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const createBankApplication = async (applicationData: BankApplicationData): Promise<DbOperationResult<number>> => {
  try {
    const result = await executeQuery<any>(
      `INSERT INTO bank_applications (customerId, portalId, applicationId, bankName, applicationStatus, submissionDate, amount, purpose, product, documents)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationData.customerId,
        applicationData.portalId || null,
        applicationData.applicationId || null,
        applicationData.bankName,
        applicationData.applicationStatus,
        applicationData.submissionDate || null,
        applicationData.amount || null,
        applicationData.purpose || null,
        applicationData.product,
        applicationData.documents ? JSON.stringify(applicationData.documents) : null
      ]
    );

    if (result.success) {
      toast({
        title: "Bank application created",
        description: `Application for ${applicationData.bankName} has been created successfully`
      });
    }

    return result;
  } catch (error) {
    console.error("Error creating bank application:", error);
    toast({
      title: "Error creating application",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const updateBankApplication = async (id: number, applicationData: Partial<BankApplicationData>): Promise<DbOperationResult> => {
  try {
    const fields = Object.keys(applicationData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(applicationData);
    
    const result = await executeQuery(
      `UPDATE bank_applications SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    if (result.success) {
      toast({
        title: "Application updated",
        description: "Bank application has been updated successfully"
      });
    }

    return result;
  } catch (error) {
    console.error("Error updating bank application:", error);
    toast({
      title: "Error updating application",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const deleteBankApplication = async (id: number): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      `DELETE FROM bank_applications WHERE id = ?`,
      [id]
    );

    if (result.success) {
      toast({
        title: "Application deleted",
        description: "Bank application has been deleted successfully"
      });
    }

    return result;
  } catch (error) {
    console.error("Error deleting bank application:", error);
    toast({
      title: "Error deleting application",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
