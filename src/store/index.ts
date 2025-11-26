import { create } from 'zustand';
import { produce } from 'immer';
import { format, addHours } from 'date-fns';

// Define types for our state
type Theme = 'light' | 'dark' | 'blue';

export type TimeSeriesData = {
  date: string;
  value: number;
  category: 'A' | 'B' | 'C' | 'D';
  percentage: number;
};

type DashboardState = {
  theme: Theme;
  selectedDataPoint: TimeSeriesData | null;
  timeSeriesData: TimeSeriesData[];
  // Actions
  setTheme: (theme: Theme) => void;
  selectDataPoint: (dataPoint: TimeSeriesData | null) => void;
  updateData: () => void;
};

// Create initial state
const initialState: Omit<DashboardState, 'setTheme' | 'selectDataPoint' | 'updateData'> = {
  theme: 'light',
  selectedDataPoint: null,
  timeSeriesData: Array.from({ length: 24 }, (_, i) => {
    const date = format(addHours(new Date(), -23 + i), 'HH:mm');
    const value = Math.floor(Math.random() * 100);
    const categories: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const percentage = Math.random() * 100;
    return { date, value, category, percentage };
  }),
};

// Create the store
export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,
  setTheme: (theme) => set({ theme }),
  selectDataPoint: (dataPoint) => set({ selectedDataPoint: dataPoint }),
  updateData: () => {
    set(produce((state) => {
      // Shift all data points back by one
      state.timeSeriesData = state.timeSeriesData.slice(1);
      // Add a new data point at the end
      const newDate = format(addHours(new Date(), 1), 'HH:mm');
      const value = Math.floor(Math.random() * 100);
      const categories: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const percentage = Math.random() * 100;
      state.timeSeriesData.push({ date: newDate, value, category, percentage });
    }));
  },
}));
