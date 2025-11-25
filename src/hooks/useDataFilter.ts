import { useMemo } from 'react';
import type { RawData, FilterConfig } from '../store/dashboardStore';
import { DataService } from '../services/DataService';

/**
 * Hook for filtering data
 * @param rawData Raw data to filter
 * @param filterConfig Filter configuration
 * @returns Filtered data
 */
export const useDataFilter = (rawData: RawData[], filterConfig: FilterConfig): RawData[] => {
  return useMemo(() => {
    return DataService.filterData(rawData, filterConfig);
  }, [rawData, filterConfig]);
};
