import type { RawData, TimeSeriesData, CategoryData, PieData, FilterConfig, AggregationConfig } from '../store/dashboardStore';
import { cacheService } from './CacheService';

/**
 * Data service for data manipulation and aggregation
 */
export class DataService {
  /**
   * Filter raw data based on filter configuration
   * @param rawData Raw data to filter
   * @param filterConfig Filter configuration
   * @returns Filtered raw data
   */
  static filterData(rawData: RawData[], filterConfig: FilterConfig): RawData[] {
    const { timeRange, categories, regions, productLines } = filterConfig;

    return rawData.filter(item => {
      // Filter by time range
      if (timeRange) {
        const [start, end] = timeRange;
        if (item.time < start || item.time > end) {
          return false;
        }
      }

      // Filter by categories
      if (categories.length > 0 && !categories.includes(item.category)) {
        return false;
      }

      // Filter by regions
      if (regions.length > 0 && !regions.includes(item.region)) {
        return false;
      }

      // Filter by product lines
      if (productLines.length > 0 && !productLines.includes(item.productLine)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Aggregate data based on aggregation configuration
   * @param rawData Raw data to aggregate
   * @param aggregationConfig Aggregation configuration
   * @returns Aggregated data (time series, category, pie)
   */
  static aggregateData(
    rawData: RawData[],
    aggregationConfig: AggregationConfig
  ): { timeSeriesData: TimeSeriesData[]; categoryData: CategoryData[]; pieData: PieData[] } {
    const { groupBy, aggregation } = aggregationConfig;

    // Create cache key based on aggregation configuration and raw data length
    const cacheKey = `aggregate_${JSON.stringify(aggregationConfig)}_${rawData.length}`;

    // Check if result is in cache
    const cachedResult = cacheService.get<{ timeSeriesData: TimeSeriesData[]; categoryData: CategoryData[]; pieData: PieData[] }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Aggregate time series data
    const timeSeriesMap = new Map<string, Record<string, number>>();
    rawData.forEach(item => {
      if (!timeSeriesMap.has(item.time)) {
        timeSeriesMap.set(item.time, { time: item.time });
      }
      const timeEntry = timeSeriesMap.get(item.time)!;
      const key = groupBy.length > 0 ? item[groupBy[0] as keyof RawData] as string : 'value';
      timeEntry[key] = (timeEntry[key] || 0) + item.value;
    });
    const timeSeriesData = Array.from(timeSeriesMap.values()) as TimeSeriesData[];

    // Aggregate category data
    const categoryMap = new Map<string, Record<string, number>>();
    rawData.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, { category: item.category });
      }
      const categoryEntry = categoryMap.get(item.category)!;
      const key = groupBy.length > 1 ? item[groupBy[1] as keyof RawData] as string : 'value';
      categoryEntry[key] = (categoryEntry[key] || 0) + item.value;
    });
    const categoryData = Array.from(categoryMap.values()) as CategoryData[];

    // Aggregate pie data
    const pieMap = new Map<string, number>();
    rawData.forEach(item => {
      const key = groupBy.length > 0 ? item[groupBy[0] as keyof RawData] as string : 'Total';
      pieMap.set(key, (pieMap.get(key) || 0) + item.value);
    });
    const pieData = Array.from(pieMap.entries()).map(([name, value]) => ({ name, value }));

    // Cache the result
    const result = { timeSeriesData, categoryData, pieData };
    cacheService.set(cacheKey, result);

    return result;
  }

  /**
   * Validate raw data format
   * @param data Data to validate
   * @returns True if data is valid, false otherwise
   */
  static validateRawData(data: any[]): data is RawData[] {
    if (!Array.isArray(data)) return false;

    return data.every(item => {
      return (
        typeof item.time === 'string' &&
        typeof item.value === 'number' &&
        typeof item.category === 'string' &&
        typeof item.region === 'string' &&
        typeof item.productLine === 'string'
      );
    });
  }
}
