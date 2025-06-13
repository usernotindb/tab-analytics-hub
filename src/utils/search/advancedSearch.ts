
export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
  secondValue?: any; // For 'between' operator
}

export interface SearchOptions {
  filters: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class AdvancedSearchBuilder {
  private filters: SearchFilter[] = [];

  addFilter(field: string, operator: SearchFilter['operator'], value: any, secondValue?: any): this {
    this.filters.push({ field, operator, value, secondValue });
    return this;
  }

  equals(field: string, value: any): this {
    return this.addFilter(field, 'equals', value);
  }

  contains(field: string, value: string): this {
    return this.addFilter(field, 'contains', value);
  }

  startsWith(field: string, value: string): this {
    return this.addFilter(field, 'startsWith', value);
  }

  endsWith(field: string, value: string): this {
    return this.addFilter(field, 'endsWith', value);
  }

  greaterThan(field: string, value: any): this {
    return this.addFilter(field, 'greaterThan', value);
  }

  lessThan(field: string, value: any): this {
    return this.addFilter(field, 'lessThan', value);
  }

  between(field: string, startValue: any, endValue: any): this {
    return this.addFilter(field, 'between', startValue, endValue);
  }

  inValues(field: string, values: any[]): this {
    return this.addFilter(field, 'in', values);
  }

  build(): SearchOptions {
    return { filters: this.filters };
  }

  buildSQLQuery(baseQuery: string): { query: string; params: any[] } {
    if (this.filters.length === 0) {
      return { query: baseQuery, params: [] };
    }

    const whereConditions: string[] = [];
    const params: any[] = [];

    this.filters.forEach(filter => {
      switch (filter.operator) {
        case 'equals':
          whereConditions.push(`${filter.field} = ?`);
          params.push(filter.value);
          break;
        case 'contains':
          whereConditions.push(`${filter.field} LIKE ?`);
          params.push(`%${filter.value}%`);
          break;
        case 'startsWith':
          whereConditions.push(`${filter.field} LIKE ?`);
          params.push(`${filter.value}%`);
          break;
        case 'endsWith':
          whereConditions.push(`${filter.field} LIKE ?`);
          params.push(`%${filter.value}`);
          break;
        case 'greaterThan':
          whereConditions.push(`${filter.field} > ?`);
          params.push(filter.value);
          break;
        case 'lessThan':
          whereConditions.push(`${filter.field} < ?`);
          params.push(filter.value);
          break;
        case 'between':
          whereConditions.push(`${filter.field} BETWEEN ? AND ?`);
          params.push(filter.value, filter.secondValue);
          break;
        case 'in':
          const placeholders = filter.value.map(() => '?').join(',');
          whereConditions.push(`${filter.field} IN (${placeholders})`);
          params.push(...filter.value);
          break;
      }
    });

    const query = `${baseQuery} WHERE ${whereConditions.join(' AND ')}`;
    return { query, params };
  }
}

export const createSearchBuilder = (): AdvancedSearchBuilder => {
  return new AdvancedSearchBuilder();
};
