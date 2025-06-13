
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const createPaginationQuery = (
  baseQuery: string,
  options: PaginationOptions,
  countQuery?: string
): { dataQuery: string; countQuery: string; offset: number } => {
  const offset = (options.page - 1) * options.limit;
  
  let dataQuery = baseQuery;
  
  // Add sorting if specified
  if (options.sortBy) {
    dataQuery += ` ORDER BY ${options.sortBy} ${options.sortOrder || 'asc'}`;
  }
  
  // Add pagination
  dataQuery += ` LIMIT ${options.limit} OFFSET ${offset}`;
  
  // Default count query if not provided
  const finalCountQuery = countQuery || `SELECT COUNT(*) as total FROM (${baseQuery}) as count_query`;
  
  return {
    dataQuery,
    countQuery: finalCountQuery,
    offset
  };
};

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> => {
  const pages = Math.ceil(total / options.limit);
  
  return {
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      pages,
      hasNext: options.page < pages,
      hasPrevious: options.page > 1
    }
  };
};

export class PaginationHelper {
  static getPageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
    const pages: number[] = [];
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  static getPaginationText(page: number, limit: number, total: number): string {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total} entries`;
  }
}
