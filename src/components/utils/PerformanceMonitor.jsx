import { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    errors: []
  });

  useEffect(() => {
    // SAFE PERFORMANCE MONITORING
    const startTime = performance.now();
    
    const updateMetrics = () => {
      try {
        const loadTime = performance.now() - startTime;
        
        // SAFE MEMORY USAGE CHECK
        let memoryUsage = 0;
        if (typeof performance !== 'undefined' && performance.memory) {
          memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        }

        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(loadTime),
          memoryUsage: Math.round(memoryUsage * 100) / 100
        }));
      } catch (error) {
        console.error('Performance monitoring error:', error?.message || 'Unknown error');
      }
    };

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    
    // Initial update
    updateMetrics();

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);

  // SAFE PERFORMANCE OBSERVER
  useEffect(() => {
    try {
      if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
          try {
            const entries = list.getEntries();
            entries.forEach(entry => {
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({
                  ...prev,
                  renderTime: Math.round(entry.startTime)
                }));
              }
            });
          } catch (error) {
            console.error('Performance observer error:', error?.message || 'Unknown error');
          }
        });

        observer.observe({ entryTypes: ['paint', 'navigation', 'resource'] });

        return () => {
          observer.disconnect();
        };
      }
    } catch (error) {
      console.error('Performance observer setup error:', error?.message || 'Unknown error');
    }
  }, []);

  // Don't render anything in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div>Load: {metrics.loadTime}ms</div>
      <div>Render: {metrics.renderTime}ms</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
    </div>
  );
};

export default PerformanceMonitor;