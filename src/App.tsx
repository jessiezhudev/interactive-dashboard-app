import { useEffect } from 'react';
import { useDashboardStore } from './store';
import LineChartComponent from './components/LineChart';
import BarChartComponent from './components/BarChart';
import PieChartComponent from './components/PieChart';
import ThemeSelector from './components/ThemeSelector';
import './App.css';

function App() {
  const { theme, updateData } = useDashboardStore();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'blue');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Real-time data update using setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [updateData]);

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50' : theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'}`}>
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">Interactive Dashboard</h1>
          <ThemeSelector />
        </header>
        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LineChartComponent title="Time Series Data" />
            <BarChartComponent title="Category Comparison" />
            <PieChartComponent title="Percentage Distribution" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
