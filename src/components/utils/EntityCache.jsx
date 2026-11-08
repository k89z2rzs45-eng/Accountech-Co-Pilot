import { globalCache } from './LoadingCache';

// Optimized entity loading with smart caching
export class OptimizedEntity {
  constructor(EntityClass, entityName) {
    this.Entity = EntityClass;
    this.name = entityName;
  }

  // Get cached or fetch data
  async list(orderBy = '-created_date', limit = 50) {
    const cacheKey = `${this.name}_list_${orderBy}_${limit}`;
    
    return await globalCache.getOrFetch(
      cacheKey,
      () => this.Entity.list(orderBy, limit),
      10 // 10 minutes cache
    );
  }

  // Get single item with cache
  async get(id) {
    const cacheKey = `${this.name}_${id}`;
    
    return await globalCache.getOrFetch(
      cacheKey,
      () => this.Entity.get(id),
      15 // 15 minutes cache for single items
    );
  }

  // Create and update cache
  async create(data) {
    const result = await this.Entity.create(data);
    
    // Invalidate list cache
    this.invalidateListCache();
    
    // Cache the new item
    globalCache.set(`${this.name}_${result.id}`, result, 15);
    
    return result;
  }

  // Update and refresh cache
  async update(id, data) {
    const result = await this.Entity.update(id, data);
    
    // Update cache
    globalCache.set(`${this.name}_${id}`, result, 15);
    
    // Invalidate list cache
    this.invalidateListCache();
    
    return result;
  }

  // Delete and clean cache
  async delete(id) {
    const result = await this.Entity.delete(id);
    
    // Remove from cache
    globalCache.cache.delete(`${this.name}_${id}`);
    
    // Invalidate list cache
    this.invalidateListCache();
    
    return result;
  }

  // Filter with cache
  async filter(filters, orderBy = '-created_date', limit = 50) {
    const filterKey = JSON.stringify(filters);
    const cacheKey = `${this.name}_filter_${filterKey}_${orderBy}_${limit}`;
    
    return await globalCache.getOrFetch(
      cacheKey,
      () => this.Entity.filter(filters, orderBy, limit),
      5 // 5 minutes cache for filtered results
    );
  }

  // Clear all cache for this entity
  invalidateListCache() {
    const keysToDelete = [];
    for (const key of globalCache.cache.keys()) {
      if (key.startsWith(`${this.name}_list`) || key.startsWith(`${this.name}_filter`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => {
      globalCache.cache.delete(key);
      globalCache.cacheExpiry.delete(key);
    });
  }

  // Get fresh data (bypass cache)
  async getFresh() {
    this.invalidateListCache();
    return await this.list();
  }
}

// Pre-optimized entities
import { Transaction } from '@/api/entities';
import { Invoice } from '@/api/entities';
import { Client } from '@/api/entities';
import { Budget } from '@/api/entities';
import { User } from '@/api/entities';

export const OptimizedTransactions = new OptimizedEntity(Transaction, 'Transaction');
export const OptimizedInvoices = new OptimizedEntity(Invoice, 'Invoice');
export const OptimizedClients = new OptimizedEntity(Client, 'Client');
export const OptimizedBudgets = new OptimizedEntity(Budget, 'Budget');
export const OptimizedUsers = new OptimizedEntity(User, 'User');