import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for chart data
export interface RawData {
  time: string;
  value: number;
  category: string;
  region: string;
  productLine: string;
}

export interface TimeSeriesData {
  time: string;
  [key: string]: string | number;
}

export interface CategoryData {
  category: string;
  [key: string]: string | number;
}

export interface PieData {
  name: string;
  value: number;
}

export interface FilterConfig {
  timeRange: [string, string] | null;
  categories: string[];
  regions: string[];
  productLines: string[];
}

export interface AggregationConfig {
  groupBy: string[];
  aggregation: 'sum' | 'avg' | 'max' | 'min';
}

export interface DataSnapshot {
  id: string;
  name: string;
  timestamp: number;
  data: RawData[];
}

export interface HistoryRecord {
  id: string;
  action: string;
  timestamp: number;
  data: Record<string, any>;
}

export type Theme = 'light' | 'dark' | 'blue';

export interface DashboardState {
  rawData: RawData[];
  timeSeriesData: TimeSeriesData[];
  categoryData: CategoryData[];
  pieData: PieData[];
  selectedTime: string | null;
  theme: Theme;
  isLoading: boolean;
  error: string | null;
  filterConfig: FilterConfig;
  aggregationConfig: AggregationConfig;
  snapshots: DataSnapshot[];
  history: HistoryRecord[];
  // Actions
  setRawData: (data: RawData[]) => void;
  setTimeSeriesData: (data: TimeSeriesData[]) => void;
  setCategoryData: (data: CategoryData[]) => void;
  setPieData: (data: PieData[]) => void;
  setSelectedTime: (time: string | null) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilterConfig: (config: Partial<FilterConfig>) => void;
  setAggregationConfig: (config: Partial<AggregationConfig>) => void;
  // Helpers
  filterData: () => void;
  aggregateData: () => void;
  saveSnapshot: (name: string) => void;
  restoreSnapshot: (id: string) => void;
  addHistoryRecord: (action: string, data: Record<string, any>) => void;
  clearHistory: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

// Initial data
const categories = ['A', 'B', 'C', 'D'];
const regions = ['North', 'South', 'East', 'West'];
const productLines = ['Line 1', 'Line 2', 'Line 3'];

const initialRawData: RawData[] = Array.from({ length: 100 }, (_, i) => {
  const time = new Date(Date.now() - (100 - i) * 60000).toLocaleTimeString();
  return {
    time,
    value: Math.floor(Math.random() * 100) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    productLine: productLines[Math.floor(Math.random() * productLines.length)],
  };
});

const initialTimeSeriesData: TimeSeriesData[] = initialRawData.reduce((acc, item) => {
  const existing = acc.find(d => d.time === item.time);
  if (existing) {
    existing[item.category] = (Number(existing[item.category]) || 0) + item.value;
  } else {
    acc.push({ time: item.time, [item.category]: item.value });
  }
  return acc;
}, [] as TimeSeriesData[]);

const initialCategoryData: CategoryData[] = categories.map(category => {
  const total = initialRawData
    .filter(item => item.category === category)
    .reduce((sum, item) => sum + item.value, 0);
  return { category, value: total };
});

const initialPieData: PieData[] = regions.map(region => {
  const total = initialRawData
    .filter(item => item.region === region)
    .reduce((sum, item) => sum + item.value, 0);
  return { name: region, value: total };
});

const initialFilterConfig: FilterConfig = {
  timeRange: null,
  categories: [],
  regions: [],
  productLines: [],
};

const initialAggregationConfig: AggregationConfig = {
  groupBy: ['category'],
  aggregation: 'sum',
};

const initialSnapshots: DataSnapshot[] = [];

const initialHistory: HistoryRecord[] = [];

// Create store
export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      rawData: initialRawData,
      timeSeriesData: initialTimeSeriesData,
      categoryData: initialCategoryData,
      pieData: initialPieData,
      selectedTime: null,
      theme: 'light',
      isLoading: false,
      error: null,
      filterConfig: initialFilterConfig,
      aggregationConfig: initialAggregationConfig,
      snapshots: initialSnapshots,
      history: initialHistory,
      setRawData: (data) => set({ rawData: data }),
      setTimeSeriesData: (data) => set({ timeSeriesData: data }),
      setCategoryData: (data) => set({ categoryData: data }),
      setPieData: (data) => set({ pieData: data }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setTheme: (theme) => set({ theme }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setFilterConfig: (config) => set((state) => ({ filterConfig: { ...state.filterConfig, ...config } })),
      setAggregationConfig: (config) => set((state) => ({ aggregationConfig: { ...state.aggregationConfig, ...config } })),
      filterData: () => {
        const { rawData, filterConfig } = get();
        // Filter by time range
        let filtered = rawData.filter(item => {
          if (filterConfig.timeRange) {
            const [start, end] = filterConfig.timeRange;
            return item.time >= start && item.time <= end;
          }
          return true;
        });

        // Filter by categories
        if (filterConfig.categories.length > 0) {
          filtered = filtered.filter(item => filterConfig.categories.includes(item.category));
        }

        // Filter by regions
        if (filterConfig.regions.length > 0) {
          filtered = filtered.filter(item => filterConfig.regions.includes(item.region));
        }

        // Filter by product lines
        if (filterConfig.productLines.length > 0) {
          filtered = filtered.filter(item => filterConfig.productLines.includes(item.productLine));
        }

        // Update raw data (we'll keep original data and use filtered for aggregation)
        // For now, we'll just update the derived data
        get().aggregateData();
      },
      aggregateData: () => {
        const { rawData, filterConfig, aggregationConfig } = get();
        // Apply filters first
        let filtered = rawData.filter(item => {
          if (filterConfig.timeRange) {
            const [start, end] = filterConfig.timeRange;
            return item.time >= start && item.time <= end;
          }
          return true;
        });

        if (filterConfig.categories.length > 0) {
          filtered = filtered.filter(item => filterConfig.categories.includes(item.category));
        }

        if (filterConfig.regions.length > 0) {
          filtered = filtered.filter(item => filterConfig.regions.includes(item.region));
        }

        if (filterConfig.productLines.length > 0) {
          filtered = filtered.filter(item => filterConfig.productLines.includes(item.productLine));
        }

        // Aggregate data based on config
        const { groupBy, aggregation } = aggregationConfig;
        const grouped = new Map<string, number[]>();

        filtered.forEach(item => {
          const key = groupBy.map(field => item[field as keyof RawData]).join('|');
          if (!grouped.has(key)) {
            grouped.set(key, []);
          }
          grouped.get(key)?.push(item.value);
        });

        // Calculate aggregated values
        const aggregated = Array.from(grouped.entries()).map(([key, values]) => {
          const keys = key.split('|');
          const result: Record<string, string | number> = {};
          groupBy.forEach((field, index) => {
            result[field] = keys[index];
          });

          switch (aggregation) {
            case 'sum':
              result.value = values.reduce((a, b) => a + b, 0);
              break;
            case 'avg':
              result.value = values.reduce((a, b) => a + b, 0) / values.length;
              break;
            case 'max':
              result.value = Math.max(...values);
              break;
            case 'min':
              result.value = Math.min(...values);
              break;
          }

          return result;
        });

        // Update derived data based on aggregation
        let timeSeriesData: TimeSeriesData[] = [];
        let categoryData: CategoryData[] = [];
        let pieData: PieData[] = [];

        if (groupBy.includes('time')) {
          // Time series data
          timeSeriesData = aggregated.map(item => {
            const timeData: TimeSeriesData = { time: item.time as string };
            // If we have another groupBy field, use it as series
            const otherGroup = groupBy.find(field => field !== 'time');
            if (otherGroup) {
              timeData[item[otherGroup] as string] = item.value as number;
            } else {
              timeData.value = item.value as number;
            }
            return timeData;
          });

          // Merge time series data with same time
          const mergedTimeSeries = new Map<string, TimeSeriesData>();
          timeSeriesData.forEach(item => {
            if (!mergedTimeSeries.has(item.time)) {
              mergedTimeSeries.set(item.time, { time: item.time });
            }
            const existing = mergedTimeSeries.get(item.time)!
            Object.entries(item).forEach(([key, value]) => {
              if (key !== 'time') {
                existing[key] = value;
              }
            });
          });
          timeSeriesData = Array.from(mergedTimeSeries.values());
        }

        if (groupBy.includes('category')) {
          // Category data
          categoryData = aggregated.map(item => ({ category: item.category as string, value: item.value as number }));
        }

        if (groupBy.includes('region') || groupBy.includes('productLine')) {
          // Pie data
          pieData = aggregated.map(item => ({
            name: (item.region || item.productLine || 'Unknown') as string,
            value: item.value as number
          }));
        }

        set({ timeSeriesData, categoryData, pieData });
      },
      saveSnapshot: (name) => {
        const { rawData, snapshots } = get();
        const newSnapshot: DataSnapshot = {
          id: crypto.randomUUID(),
          name,
          timestamp: Date.now(),
          data: [...rawData]
        };
        const updatedSnapshots = [...snapshots, newSnapshot].slice(-10); // Keep only last 10 snapshots
        set({ snapshots: updatedSnapshots });
        get().addHistoryRecord('saveSnapshot', { name, id: newSnapshot.id });
      },
      restoreSnapshot: (id) => {
        const { snapshots } = get();
        const snapshot = snapshots.find(s => s.id === id);
        if (snapshot) {
          set({ rawData: [...snapshot.data] });
          get().aggregateData();
          get().addHistoryRecord('restoreSnapshot', { id, name: snapshot.name });
        }
      },
      addHistoryRecord: (action, data) => {
        const { history } = get();
        const newRecord: HistoryRecord = {
          id: crypto.randomUUID(),
          action,
          timestamp: Date.now(),
          data
        };
        const updatedHistory = [...history, newRecord].slice(-10); // Keep only last 10 records
        set({ history: updatedHistory });
      },
      clearHistory: () => set({ history: [] }),
      exportData: () => {
        const { rawData, filterConfig, aggregationConfig } = get();
        const exportData = {
          rawData,
          filterConfig,
          aggregationConfig,
          timestamp: Date.now()
        };
        return JSON.stringify(exportData, null, 2);
      },
      importData: (json) => {
        try {
          const importData = JSON.parse(json);
          if (importData.rawData) {
            set({ rawData: importData.rawData });
          }
          if (importData.filterConfig) {
            set({ filterConfig: importData.filterConfig });
          }
          if (importData.aggregationConfig) {
            set({ aggregationConfig: importData.aggregationConfig });
          }
          get().aggregateData();
          get().addHistoryRecord('importData', { timestamp: importData.timestamp });
        } catch (_error) {
          get().setError('Failed to import data: Invalid JSON format');
        }
      },
    }),
    {
      name: 'dashboard-storage', // Local storage key
    }
  )
);
