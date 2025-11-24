// Types for the dashboard application

export interface TimeSeriesData {
  time: string;
  value: number;
  category: string;
}

export interface CategoryData {
  category: string;
  value: number;
}

export interface PieData {
  name: string;
  value: number;
}

export interface FilterState {
  selectedTime?: string;
  selectedCategory?: string;
}

export type Theme = 'light' | 'dark' | 'blue';