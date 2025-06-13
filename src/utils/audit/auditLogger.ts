
export interface AuditLogEntry {
  id: number;
  userId: string;
  action: string;
  entityType: 'customer' | 'portal' | 'bank_app' | 'software';
  entityId: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface AuditLogResult {
  success: boolean;
  data?: AuditLogEntry[];
  message?: string;
}

import { executeQuery } from "../database/dbOperations";

export const logAuditEvent = async (
  userId: string,
  action: string,
  entityType: AuditLogEntry['entityType'],
  entityId: number,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
): Promise<{ success: boolean; message?: string }> => {
  try {
    const result = await executeQuery(
      `INSERT INTO audit_logs (userId, action, entityType, entityId, oldValues, newValues, timestamp, ipAddress)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        action,
        entityType,
        entityId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        new Date().toISOString(),
        'localhost' // In a real app, this would be the actual IP
      ]
    );

    if (result.success) {
      console.log(`Audit log created: ${action} on ${entityType} ${entityId}`);
      return { success: true };
    }

    return { success: false, message: "Failed to create audit log" };
  } catch (error) {
    console.error("Error creating audit log:", error);
    return { success: false, message: `Error creating audit log: ${error}` };
  }
};

export const getAuditLogs = async (
  entityType?: AuditLogEntry['entityType'],
  entityId?: number,
  limit = 100
): Promise<AuditLogResult> => {
  try {
    let query = `SELECT * FROM audit_logs`;
    const params: any[] = [];

    if (entityType && entityId) {
      query += ` WHERE entityType = ? AND entityId = ?`;
      params.push(entityType, entityId);
    } else if (entityType) {
      query += ` WHERE entityType = ?`;
      params.push(entityType);
    }

    query += ` ORDER BY timestamp DESC LIMIT ?`;
    params.push(limit);

    const result = await executeQuery<any[]>(query, params);

    if (result.success && result.data) {
      const logs: AuditLogEntry[] = result.data.map(row => ({
        id: row.id,
        userId: row.userId,
        action: row.action,
        entityType: row.entityType,
        entityId: row.entityId,
        oldValues: row.oldValues ? JSON.parse(row.oldValues) : undefined,
        newValues: row.newValues ? JSON.parse(row.newValues) : undefined,
        timestamp: row.timestamp,
        ipAddress: row.ipAddress
      }));

      return { success: true, data: logs };
    }

    return { success: false, message: "No audit logs found" };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { success: false, message: `Error fetching audit logs: ${error}` };
  }
};
