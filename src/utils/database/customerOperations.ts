
import { executeQuery, DbOperationResult } from "./dbOperations";
import { Customer } from "@/types/customer";
import { toast } from "@/hooks/use-toast";

export interface CustomerData {
  userId?: string;
  efin?: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  businessPhone?: string;
  cellPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export const fetchAllCustomers = async (): Promise<DbOperationResult<Customer[]>> => {
  try {
    const result = await executeQuery<any[]>(
      `SELECT c.*, 
              COUNT(DISTINCT p.id) as portalCount,
              COUNT(DISTINCT CASE WHEN p.status = 'ready' THEN p.id END) as readyPortals,
              COUNT(DISTINCT ba.id) as bankAppCount,
              COUNT(DISTINCT CASE WHEN ba.applicationStatus = 'submitted' THEN ba.id END) as submittedApps,
              COUNT(DISTINCT ps.id) as softwareCount,
              COUNT(DISTINCT CASE WHEN ps.status = 'active' THEN ps.id END) as activeSoftware
       FROM customers c
       LEFT JOIN portals p ON c.id = p.customerId
       LEFT JOIN bank_applications ba ON c.id = ba.customerId
       LEFT JOIN paid_software ps ON c.id = ps.customerId
       WHERE c.status = 'active'
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );

    if (result.success && result.data) {
      const customers: Customer[] = result.data.map((row: any) => ({
        id: row.id,
        userId: row.userId || '',
        efin: row.efin || '',
        company: row.company || '',
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email || '',
        businessPhone: row.businessPhone || '',
        cellPhone: row.cellPhone || '',
        portalReady: (row.readyPortals || 0) > 0,
        bankAppSubmitted: (row.submittedApps || 0) > 0,
        softwarePaid: (row.activeSoftware || 0) > 0,
      }));

      return {
        success: true,
        data: customers,
        message: "Customers fetched successfully"
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      message: `Error fetching customers: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const createCustomer = async (customerData: CustomerData): Promise<DbOperationResult<number>> => {
  try {
    const result = await executeQuery<any>(
      `INSERT INTO customers (userId, efin, company, firstName, lastName, email, businessPhone, cellPhone, address, city, state, zipCode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerData.userId || null,
        customerData.efin || null,
        customerData.company,
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.businessPhone || null,
        customerData.cellPhone || null,
        customerData.address || null,
        customerData.city || null,
        customerData.state || null,
        customerData.zipCode || null,
        customerData.status || 'active'
      ]
    );

    if (result.success) {
      toast({
        title: "Customer created",
        description: `${customerData.firstName} ${customerData.lastName} has been added successfully`
      });
    }

    return result;
  } catch (error) {
    console.error("Error creating customer:", error);
    toast({
      title: "Error creating customer",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const updateCustomer = async (id: number, customerData: Partial<CustomerData>): Promise<DbOperationResult> => {
  try {
    const fields = Object.keys(customerData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(customerData);
    
    const result = await executeQuery(
      `UPDATE customers SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    if (result.success) {
      toast({
        title: "Customer updated",
        description: "Customer information has been updated successfully"
      });
    }

    return result;
  } catch (error) {
    console.error("Error updating customer:", error);
    toast({
      title: "Error updating customer",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const deleteCustomer = async (id: number): Promise<DbOperationResult> => {
  try {
    const result = await executeQuery(
      `UPDATE customers SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );

    if (result.success) {
      toast({
        title: "Customer deleted",
        description: "Customer has been marked as inactive"
      });
    }

    return result;
  } catch (error) {
    console.error("Error deleting customer:", error);
    toast({
      title: "Error deleting customer",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive"
    });
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const getCustomerById = async (id: number): Promise<DbOperationResult<Customer>> => {
  try {
    const result = await executeQuery<any[]>(
      `SELECT c.*, 
              COUNT(DISTINCT p.id) as portalCount,
              COUNT(DISTINCT CASE WHEN p.status = 'ready' THEN p.id END) as readyPortals,
              COUNT(DISTINCT ba.id) as bankAppCount,
              COUNT(DISTINCT CASE WHEN ba.applicationStatus = 'submitted' THEN ba.id END) as submittedApps,
              COUNT(DISTINCT ps.id) as softwareCount,
              COUNT(DISTINCT CASE WHEN ps.status = 'active' THEN ps.id END) as activeSoftware
       FROM customers c
       LEFT JOIN portals p ON c.id = p.customerId
       LEFT JOIN bank_applications ba ON c.id = ba.customerId
       LEFT JOIN paid_software ps ON c.id = ps.customerId
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (result.success && result.data && result.data.length > 0) {
      const row = result.data[0];
      const customer: Customer = {
        id: row.id,
        userId: row.userId || '',
        efin: row.efin || '',
        company: row.company || '',
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email || '',
        businessPhone: row.businessPhone || '',
        cellPhone: row.cellPhone || '',
        portalReady: (row.readyPortals || 0) > 0,
        bankAppSubmitted: (row.submittedApps || 0) > 0,
        softwarePaid: (row.activeSoftware || 0) > 0,
      };

      return {
        success: true,
        data: customer,
        message: "Customer fetched successfully"
      };
    }

    return {
      success: false,
      message: "Customer not found"
    };
  } catch (error) {
    console.error("Error fetching customer:", error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
