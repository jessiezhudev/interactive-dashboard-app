import { useEffect, useRef } from 'react';

/**
 * Hook for monitoring performance metrics
 * @param name Metric name
 * @param threshold Threshold in milliseconds
 */
export const usePerformanceMonitor = (name: string, threshold: number = 100) => {
  const startTimeRef = useRef<number>(0);

  const start = useRef(() => {
    startTimeRef.current = performance.now();
  });

  const end = useRef(() => {
    const duration = performance.now() - startTimeRef.current;
    if (duration > threshold) {
      console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }
    return duration;
  });

  useEffect(() => {
    // Log component mount time
    const mountTime = performance.now();
    return () => {
      const unmountTime = performance.now();
      const duration = unmountTime - mountTime;
      if (duration > threshold) {
        console.warn(`Performance warning: ${name} component lifecycle took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
      }
    };
  }, [name, threshold]);

  return { start: start.current, end: end.current };
};
