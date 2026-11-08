// Global cache for reducing API calls and improving performance
class LoadingCache {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.cacheExpiry = new Map();
  }

  // Cache with expiration
  set(key, value, expirationMinutes = 5) {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + (expirationMinutes * 60 * 1000));
  }

  get(key) {
    // Check if cached data exists and hasn't expired
    if (this.cache.has(key)) {
      const expiry = this.cacheExpiry.get(key);
      if (Date.now() < expiry) {
        return this.cache.get(key);
      } else {
        // Remove expired data
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
    return null;
  }

  // Prevent duplicate API calls
  async getOrFetch(key, fetchFunction, expirationMinutes = 5) {
    // Return cached data if available
    const cached = this.get(key);
    if (cached) {
      return cached;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(key)) {
      return await this.loadingPromises.get(key);
    }

    // Start new fetch
    const promise = fetchFunction()
      .then(data => {
        this.set(key, data, expirationMinutes);
        this.loadingPromises.delete(key);
        return data;
      })
      .catch(error => {
        this.loadingPromises.delete(key);
        throw error;
      });

    this.loadingPromises.set(key, promise);
    return await promise;
  }

  clear() {
    this.cache.clear();
    this.cacheExpiry.clear();
    this.loadingPromises.clear();
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, expiry] of this.cacheExpiry) {
      if (now >= expiry) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }
}

// Global cache instance
export const globalCache = new LoadingCache();

// Performance monitoring
export const performanceTracker = {
  startTime: null,
  
  start(operation) {
    this.startTime = performance.now();
    console.log(`🚀 Starting ${operation}...`);
  },
  
  end(operation) {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      console.log(`✅ ${operation} completed in ${duration.toFixed(2)}ms`);
      this.startTime = null;
    }
  }
};

// Batch API calls to reduce requests
export const batchApiCalls = {
  queue: [],
  isProcessing: false,
  
  add(apiCall) {
    this.queue.push(apiCall);
    if (!this.isProcessing) {
      this.process();
    }
  },
  
  async process() {
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, 5); // Process 5 at a time
      await Promise.all(batch.map(call => call()));
      
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.isProcessing = false;
  }
};