import { useEffect, useState } from 'react';

/**
 * Throttle hook to limit function execution frequency
 * @param value The value to throttle
 * @param limit Limit in milliseconds
 * @returns Throttled value
 */
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdate >= limit) {
      setThrottledValue(value);
      setLastUpdate(now);
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        setLastUpdate(Date.now());
      }, limit - (now - lastUpdate));
      return () => clearTimeout(timer);
    }
  }, [value, limit, lastUpdate]);

  return throttledValue;
};
