import { create } from 'zustand';
import type { TimeSeriesData, CategoryData, PieData, FilterState, Theme } from '../types';
import { generateCategoryData, generatePieData } from '../services/dataService';

interface DashboardStore {
  // Data
  timeSeriesData: TimeSeriesData[];
  categoryData: CategoryData[];
  pieData: PieData[];
  
  // Filters
  filters: FilterState;
  
  // Theme
  theme: Theme;
  
  // Loading and error states
  isLoading: boolean;
  hasError: boolean;
  
  // Actions
  addTimeSeriesData: (data: TimeSeriesData) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  clearData: () => void;
}

const MAX_TIME_SERIES_DATA = 50;

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
  timeSeriesData: [],
  categoryData: [],
  pieData: [],
  filters: {},
  theme: 'light',
  isLoading: true,
  hasError: false,
  
  // Actions
  addTimeSeriesData: (data) => {
    set((state) => {
      const updatedTimeSeries = [...state.timeSeriesData, data];
      
      // Keep only the last MAX_TIME_SERIES_DATA points
      if (updatedTimeSeries.length > MAX_TIME_SERIES_DATA) {
        updatedTimeSeries.shift();
      }
      
      // Apply filters if any
      const filteredData = get().filters.selectedCategory
        ? updatedTimeSeries.filter(d => d.category === get().filters.selectedCategory)
        : updatedTimeSeries;
      
      return {
        timeSeriesData: updatedTimeSeries,
        categoryData: generateCategoryData(filteredData),
        pieData: generatePieData(filteredData)
      };
    });
  },
  
  setFilters: (filters) => {
    set((state) => {
      const newFilters = { ...state.filters, ...filters };
      
      // Filter time series data based on new filters
      const filteredData = state.timeSeriesData.filter(d => {
        if (newFilters.selectedCategory && d.category !== newFilters.selectedCategory) {
          return false;
        }
        if (newFilters.selectedTime && d.time !== newFilters.selectedTime) {
          return false;
        }
        return true;
      });
      
      return {
        filters: newFilters,
        categoryData: generateCategoryData(filteredData),
        pieData: generatePieData(filteredData)
      };
    });
  },
  
  clearFilters: () => {
    set((state) => ({
      filters: {},
      categoryData: generateCategoryData(state.timeSeriesData),
      pieData: generatePieData(state.timeSeriesData)
    }));
  },
  
  setTheme: (theme) => {
    set({ theme });
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setError: (error) => {
    set({ hasError: error });
  },
  
  clearData: () => {
    set({ 
      timeSeriesData: [], 
      categoryData: [], 
      pieData: [],
      filters: {}
    });
  }
}));
