
import { executeQuery } from "../database/dbOperations";

export interface DashboardStats {
  totalCustomers: number;
  totalPortals: number;
  totalBankApplications: number;
  totalSoftware: number;
  portalsReady: number;
  portalsNotReady: number;
  bankAppsSubmitted: number;
  bankAppsUnsubmitted: number;
  softwarePaid: number;
  softwarePending: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'customer' | 'portal' | 'bank_app' | 'software';
  action: string;
  description: string;
  timestamp: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export const getDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
  try {
    // Get total customers
    const customersResult = await executeQuery<any[]>("SELECT COUNT(*) as count FROM customers");
    const totalCustomers = customersResult.success && customersResult.data ? customersResult.data[0].count : 0;

    // Get portal statistics
    const portalsResult = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ready' THEN 1 ELSE 0 END) as ready,
        SUM(CASE WHEN status = 'not_ready' THEN 1 ELSE 0 END) as not_ready
      FROM portals
    `);
    const portalStats = portalsResult.success && portalsResult.data ? portalsResult.data[0] : { total: 0, ready: 0, not_ready: 0 };

    // Get bank application statistics
    const bankAppsResult = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted,
        SUM(CASE WHEN status = 'unsubmitted' THEN 1 ELSE 0 END) as unsubmitted
      FROM bank_applications
    `);
    const bankAppStats = bankAppsResult.success && bankAppsResult.data ? bankAppsResult.data[0] : { total: 0, submitted: 0, unsubmitted: 0 };

    // Get software statistics
    const softwareResult = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN status IN ('pending', 'overdue') THEN 1 ELSE 0 END) as pending
      FROM paid_software
    `);
    const softwareStats = softwareResult.success && softwareResult.data ? softwareResult.data[0] : { total: 0, paid: 0, pending: 0 };

    // Get recent activity (simplified)
    const recentActivity: ActivityItem[] = [
      {
        id: 1,
        type: 'customer',
        action: 'created',
        description: 'New customer added to the system',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'portal',
        action: 'status_changed',
        description: 'Portal status updated to ready',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: 3,
        type: 'bank_app',
        action: 'submitted',
        description: 'Bank application submitted for review',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      }
    ];

    const stats: DashboardStats = {
      totalCustomers,
      totalPortals: portalStats.total,
      totalBankApplications: bankAppStats.total,
      totalSoftware: softwareStats.total,
      portalsReady: portalStats.ready,
      portalsNotReady: portalStats.not_ready,
      bankAppsSubmitted: bankAppStats.submitted,
      bankAppsUnsubmitted: bankAppStats.unsubmitted,
      softwarePaid: softwareStats.paid,
      softwarePending: softwareStats.pending,
      recentActivity
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, message: `Error fetching dashboard stats: ${error}` };
  }
};

export const getPortalStatusDistribution = async (): Promise<{ success: boolean; data?: ChartData[]; message?: string }> => {
  try {
    const result = await executeQuery<any[]>(`
      SELECT 
        status,
        COUNT(*) as count
      FROM portals
      GROUP BY status
    `);

    if (result.success && result.data) {
      const data: ChartData[] = result.data.map(row => ({
        name: row.status.charAt(0).toUpperCase() + row.status.slice(1).replace('_', ' '),
        value: row.count
      }));
      return { success: true, data };
    }

    return { success: false, message: "No data found" };
  } catch (error) {
    console.error("Error fetching portal status distribution:", error);
    return { success: false, message: `Error fetching portal status distribution: ${error}` };
  }
};

export const getBankApplicationTrends = async (): Promise<{ success: boolean; data?: ChartData[]; message?: string }> => {
  try {
    const result = await executeQuery<any[]>(`
      SELECT 
        status,
        COUNT(*) as count
      FROM bank_applications
      GROUP BY status
    `);

    if (result.success && result.data) {
      const data: ChartData[] = result.data.map(row => ({
        name: row.status.charAt(0).toUpperCase() + row.status.slice(1),
        value: row.count
      }));
      return { success: true, data };
    }

    return { success: false, message: "No data found" };
  } catch (error) {
    console.error("Error fetching bank application trends:", error);
    return { success: false, message: `Error fetching bank application trends: ${error}` };
  }
};

// Demo data fallback functions
export const getDemoStats = (): DashboardStats => {
  return {
    totalCustomers: 150,
    totalPortals: 120,
    totalBankApplications: 85,
    totalSoftware: 95,
    portalsReady: 85,
    portalsNotReady: 35,
    bankAppsSubmitted: 60,
    bankAppsUnsubmitted: 25,
    softwarePaid: 75,
    softwarePending: 20,
    recentActivity: [
      {
        id: 1,
        type: 'customer',
        action: 'created',
        description: 'New customer "Azteca Tax Systems" added',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'portal',
        action: 'status_changed',
        description: 'Xlink portal status updated to ready',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: 3,
        type: 'bank_app',
        action: 'submitted',
        description: 'Bank application for Cross River submitted',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      }
    ]
  };
};

export const getDemoPortalDistribution = (): ChartData[] => {
  return [
    { name: "Ready", value: 85 },
    { name: "Not Ready", value: 25 },
    { name: "Pending", value: 10 }
  ];
};

export const getDemoBankAppTrends = (): ChartData[] => {
  return [
    { name: "Submitted", value: 60 },
    { name: "Unsubmitted", value: 25 }
  ];
};
