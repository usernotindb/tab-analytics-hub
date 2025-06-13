
export interface BatchOperation<T> {
  type: 'create' | 'update' | 'delete';
  data: T;
  id?: number;
}

export interface BatchResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors: Array<{ index: number; error: string }>;
}

export class BatchProcessor {
  static async processBatch<T>(
    operations: BatchOperation<T>[],
    processor: (operation: BatchOperation<T>) => Promise<{ success: boolean; error?: string }>,
    batchSize: number = 100
  ): Promise<BatchResult> {
    const result: BatchResult = {
      success: true,
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    // Process in chunks to avoid overwhelming the database
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (operation, batchIndex) => {
        try {
          const operationResult = await processor(operation);
          
          if (operationResult.success) {
            result.successCount++;
          } else {
            result.errorCount++;
            result.errors.push({
              index: i + batchIndex,
              error: operationResult.error || 'Unknown error'
            });
          }
        } catch (error) {
          result.errorCount++;
          result.errors.push({
            index: i + batchIndex,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      await Promise.all(batchPromises);
    }

    result.success = result.errorCount === 0;
    return result;
  }

  static createBulkInsertQuery(
    tableName: string,
    fields: string[],
    valueRows: any[][]
  ): { query: string; params: any[] } {
    const placeholders = fields.map(() => '?').join(',');
    const valueGroups = valueRows.map(() => `(${placeholders})`).join(',');
    
    const query = `INSERT INTO ${tableName} (${fields.join(',')}) VALUES ${valueGroups}`;
    const params = valueRows.flat();
    
    return { query, params };
  }

  static createBulkUpdateQuery(
    tableName: string,
    updates: Array<{ id: number; fields: Record<string, any> }>
  ): { query: string; params: any[] } {
    // For MySQL, we'll use a CASE statement approach
    const fieldNames = Object.keys(updates[0]?.fields || {});
    const params: any[] = [];
    
    const setClauses = fieldNames.map(field => {
      const cases = updates.map(update => {
        params.push(update.id, update.fields[field]);
        return `WHEN id = ? THEN ?`;
      }).join(' ');
      
      return `${field} = CASE ${cases} END`;
    }).join(', ');
    
    const ids = updates.map(update => {
      params.push(update.id);
      return '?';
    }).join(',');
    
    const query = `UPDATE ${tableName} SET ${setClauses} WHERE id IN (${ids})`;
    
    return { query, params };
  }
}
