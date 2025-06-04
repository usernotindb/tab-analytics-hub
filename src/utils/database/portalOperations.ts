
import { executeQuery, DbOperationResult } from "./dbOperations";
import { toast } from "@/hooks/use-toast";

export interface Portal {
  id: number;
  customerId: number;
  userId?: string;
  company?: string;
  portalName: string;
  portalUrl?: string;
  software?: string;
  type?: string;
  userType?: string;
  installed?: boolean;
  license?: string;
  installedBy?: string;
  status: 'ready' | 'not_ready' | 'pending' | 'error';
  lastChecked?: string;
  errorMessage?: string;
  accessCredentials?: any;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchAllPortals = async (): Promise<DbOperationResult<Portal[]>> => {
  try {
    const result = await executeQuery<any[]>(
      `SELECT p.*, c.userId, c.company, c.firstName, c.lastName
       FROM portals p
       JOIN customers c ON p.customerId = c.id
       WHERE c.status = 'active'
       ORDER BY p.created_at DESC`
    );

    if (result.success && result.data) {
      const portals: Portal[] = result.data.map((row: any) => ({
        id: row.id,
        customerId: row.customerId,
        userId: row.userId || '',
        company: row.company || '',
        portalName: row.portalName,
        portalUrl: row.portalUrl || '',
        software: row.portalName, // Using portalName as software for compatibility
        type: 'Desktop', // Default value for compatibility
        userType: 'Standard User', // Default value for compatibility
        installed: row.status === 'ready',
        license: '', // Default value for compatibility
        installedBy: `${row.firstName} ${row.lastName}`,
        status: row.status,
        lastChecked: row.lastChecked,
        errorMessage: row.errorMessage,
        accessCredentials: row.accessCredentials,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return {
        success: true,
        data: portals,
        message: "Portals fetched successfully"
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching portals:", error);
    return {
      success: false,
      message: `Error fetching portals: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const fetchPortalsByStatus = async (status: 'ready' | 'not_ready' | 'pending' | 'error'): Promise<DbOperationResult<Portal[]>> => {
  try {
    const result = await executeQuery<any[]>(
      `SELECT p.*, c.userId, c.company, c.firstName, c.lastName
       FROM portals p
       JOIN customers c ON p.customerId = c.id
       WHERE p.status = ? AND c.status = 'active'
       ORDER BY p.created_at DESC`,
      [status]
    );

    if (result.success && result.data) {
      const portals: Portal[] = result.data.map((row: any) => ({
        id: row.id,
        customerId: row.customerId,
        userId: row.userId || '',
        company: row.company || '',
        portalName: row.portalName,
        portalUrl: row.portalUrl || '',
        software: row.portalName,
        type: 'Desktop',
        userType: 'Standard User',
        installed: row.status === 'ready',
        license: '',
        installedBy: `${row.firstName} ${row.lastName}`,
        status: row.status,
        lastChecked: row.lastChecked,
        errorMessage: row.errorMessage,
        accessCredentials: row.accessCredentials,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return {
        success: true,
        data: portals,
        message: `${status} portals fetched successfully`
      };
    }

    return result;
  } catch (error) {
    console.error(`Error fetching ${status} portals:`, error);
    return {
      success: false,
      message: `Error fetching ${status} portals: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const createPortal = async (portalData: {
  customerId: number;
  portalName: string;
  portalUrl?: string;
  status?: 'ready' | 'not_ready' | 'pending' | 'error';
  accessCredentials?: any;
}): Promise<DbOperationResult<number>> => {
  try {
    const result = await executeQuery<any>(
      `INSERT INTO portals (customerId, portalName, portalUrl, status, accessCredentials)
       VALUES (?, ?, ?, ?, ?)`,
      [
        portalData.customerId,
        portalData.portalName,
        portalData.portalUrl || null,
        portalData.status || 'pending',
        portalData.accessCredentials ? JSON.stringify(portalData.accessCredentials) : null
      ]
    );

    if (result.success) {
      toast({
        title: "Portal created",
        description: `Portal ${portalData.portalName} has been created successfully`
      });
    }

    return result;
  } catch (error) {
    console.error("Error creating portal:", error);
    toast({
      title: "Error creating portal",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const updatePortalStatus = async (id: number, status: 'ready' | 'not_ready' | 'pending' | 'error', errorMessage?: string): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      `UPDATE portals SET status = ?, errorMessage = ?, lastChecked = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, errorMessage || null, id]
    );

    if (result.success) {
      toast({
        title: "Portal status updated",
        description: `Portal status changed to ${status}`
      });
    }

    return result;
  } catch (error) {
    console.error("Error updating portal status:", error);
    toast({
      title: "Error updating portal",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const deletePortal = async (id: number): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      `DELETE FROM portals WHERE id = ?`,
      [id]
    );

    if (result.success) {
      toast({
        title: "Portal deleted",
        description: "Portal has been deleted successfully"
      });
    }

    return result;
  } catch (error) {
    console.error("Error deleting portal:", error);
    toast({
      title: "Error deleting portal",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
