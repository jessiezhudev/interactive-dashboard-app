import { useEffect } from 'react';
import { motion } from 'framer-motion';

import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import ThemeSwitcher from './components/ThemeSwitcher';
import FilterPanel from './components/FilterPanel';
import { useDashboardStore } from './store/dashboardStore';
import type { RawData } from './store/dashboardStore';
import './App.css';

function App() {
  const {
    timeSeriesData,
    categoryData,
    pieData,
    rawData,
    theme,
    isLoading,
    error,
    setRawData,
    setLoading,
    setError,
  } = useDashboardStore();

  // Simulate WebSocket real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setLoading(true);
        // Generate new data point
        const now = new Date().toLocaleTimeString();
        const categories = ['A', 'B', 'C', 'D'];
        const regions = ['North', 'South', 'East', 'West'];
        const productLines = ['Line 1', 'Line 2', 'Line 3'];
        const newDataPoint: RawData = {
          time: now,
          value: Math.floor(Math.random() * 100) + 10,
          category: categories[Math.floor(Math.random() * categories.length)],
          region: regions[Math.floor(Math.random() * regions.length)],
          productLine: productLines[Math.floor(Math.random() * productLines.length)],
        };

        // Update raw data (keep last 100 points)
        const updatedRawData = [...rawData, newDataPoint].slice(-100);
        setRawData(updatedRawData);
        setError(null);
      } catch (err) {
        setError('Failed to update data');
        console.error('Data update error:', err);
      } finally {
        setLoading(false);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [rawData, setRawData, setLoading, setError]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900' : theme === 'blue' ? 'bg-blue-100' : 'bg-gray-50'}`}>
      <header className="bg-white dark:bg-gray-800 blue:bg-blue-50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white blue:text-blue-800">Interactive Dashboard</h1>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Loading state - Skeleton screen */}
        {isLoading && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 blue:bg-blue-50 rounded-lg shadow-md p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 blue:bg-blue-50 rounded-lg shadow-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 blue:bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 dark:text-red-300 blue:text-red-700">{error}</p>
          </div>
        )}

        {/* Main content */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Filter Panel */}
            <FilterPanel />

            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <LineChart data={timeSeriesData} />
              </motion.div>
              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <BarChart data={categoryData} />
              </motion.div>
              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <PieChart data={pieData} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 blue:bg-blue-50 shadow-inner transition-all duration-300 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400 blue:text-blue-600">
          <p>Interactive Dashboard App - Built with React, TypeScript, Tailwind CSS, Recharts, and Zustand</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
