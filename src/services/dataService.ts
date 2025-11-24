import type { TimeSeriesData, CategoryData, PieData } from '../types';

// Generate random time series data
export const generateTimeSeriesData = (): TimeSeriesData => {
  const categories = ['A', 'B', 'C', 'D'];
  const now = new Date();
  const time = now.toLocaleTimeString();
  
  return {
    time,
    value: Math.floor(Math.random() * 100) + 50,
    category: categories[Math.floor(Math.random() * categories.length)]
  };
};

// Generate category data from time series
export const generateCategoryData = (timeSeriesData: TimeSeriesData[]): CategoryData[] => {
  const categoryMap: Record<string, number> = {};
  
  timeSeriesData.forEach(data => {
    if (categoryMap[data.category]) {
      categoryMap[data.category] += data.value;
    } else {
      categoryMap[data.category] = data.value;
    }
  });
  
  return Object.entries(categoryMap).map(([category, value]) => ({
    category,
    value
  }));
};

// Generate pie chart data from time series
export const generatePieData = (timeSeriesData: TimeSeriesData[]): PieData[] => {
  const categoryMap: Record<string, number> = {};
  
  timeSeriesData.forEach(data => {
    if (categoryMap[data.category]) {
      categoryMap[data.category] += 1;
    } else {
      categoryMap[data.category] = 1;
    }
  });
  
  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));
};

// WebSocket simulation with setInterval
export const subscribeToData = (callback: (data: TimeSeriesData) => void, errorCallback?: () => void) => {
  // Simulate connection
  const connectionInterval = setInterval(() => {
    // Simulate occasional network error
    if (Math.random() < 0.05) {
      if (errorCallback) errorCallback();
      return;
    }
    
    const data = generateTimeSeriesData();
    callback(data);
  }, 2000);
  
  // Return unsubscribe function
  return () => {
    clearInterval(connectionInterval);
  };
};
