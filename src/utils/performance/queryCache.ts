
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class QueryCache {
  private static cache = new Map<string, CacheEntry<any>>();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  static invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  static invalidateByEntity(entityType: string, entityId?: number): void {
    const pattern = entityId ? `${entityType}-${entityId}` : entityType;
    this.invalidate(pattern);
  }

  static getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const cacheKey = {
  customers: (page?: number, limit?: number) => 
    `customers${page !== undefined ? `-page-${page}` : ''}${limit !== undefined ? `-limit-${limit}` : ''}`,
  customer: (id: number) => `customer-${id}`,
  portals: (status?: string, page?: number) => 
    `portals${status ? `-${status}` : ''}${page !== undefined ? `-page-${page}` : ''}`,
  portal: (id: number) => `portal-${id}`,
  bankApps: (status?: string) => `bank-apps${status ? `-${status}` : ''}`,
  software: () => 'software',
  dashboardStats: () => 'dashboard-stats'
};
