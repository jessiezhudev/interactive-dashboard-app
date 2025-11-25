import LRU from 'lru-cache';

/**
 * Cache service using LRU strategy
 */
export class CacheService {
  private cache: LRU<string, any>;

  constructor(maxSize: number = 10) {
    this.cache = new LRU({ max: maxSize });
  }

  /**
   * Get value from cache
   * @param key Cache key
   * @returns Cached value or undefined
   */
  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  /**
   * Set value in cache
   * @param key Cache key
   * @param value Value to cache
   */
  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  /**
   * Delete value from cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns Number of items in cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Create singleton instance
export const cacheService = new CacheService(10);
