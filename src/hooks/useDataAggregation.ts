import { useMemo } from 'react';
import type { RawData, TimeSeriesData, CategoryData, PieData, AggregationConfig } from '../store/dashboardStore';
import { DataService } from '../services/DataService';

/**
 * Hook for aggregating data
 * @param rawData Raw data to aggregate
 * @param aggregationConfig Aggregation configuration
 * @returns Aggregated data (time series, category, pie)
 */
export const useDataAggregation = (
  rawData: RawData[],
  aggregationConfig: AggregationConfig
): { timeSeriesData: TimeSeriesData[]; categoryData: CategoryData[]; pieData: PieData[] } => {
  return useMemo(() => {
    return DataService.aggregateData(rawData, aggregationConfig);
  }, [rawData, aggregationConfig]);
};
