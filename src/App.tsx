import { useEffect, useState } from 'react';
import { useDashboardStore } from './store/dashboardStore';
import { subscribeToData } from './services/dataService';
import LineChartComponent from './components/LineChartComponent';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';
import ThemeToggle from './components/ThemeToggle';
import FilterPanel from './components/FilterPanel';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import './App.css';

function App() {
  const { 
    isLoading, 
    hasError, 
    setLoading, 
    setError, 
    addTimeSeriesData,
    clearData,
    theme
  } = useDashboardStore();
  const [retryCount, setRetryCount] = useState(0);

  // Initialize data subscription
  useEffect(() => {
    setLoading(true);
    setError(false);
    clearData();

    // Simulate initial data load delay
    const initialLoadTimeout = setTimeout(() => {
      const unsubscribe = subscribeToData(
        (data) => {
          addTimeSeriesData(data);
          setLoading(false);
          setError(false);
        },
        () => {
          setError(true);
          setLoading(false);
          // Auto-retry up to 3 times
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }, 1500);

    return () => {
      clearTimeout(initialLoadTimeout);
    };
  }, [retryCount]);

  // Handle retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Dashboard App</h1>
            <p className="app-subtitle">Real-time data visualization dashboard</p>
          </div>
          <div className="header-right">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Filter Panel */}
        <FilterPanel className="filter-panel-wrapper" />

        {/* Charts Grid */}
        {isLoading ? (
          <div className="loading-wrapper">
            <LoadingState />
          </div>
        ) : hasError ? (
          <div className="error-wrapper">
            <ErrorState onRetry={handleRetry} />
          </div>
        ) : (
          <div className="charts-grid">
            <div className="chart-card">
              <LineChartComponent title="Real-time Metrics" />
            </div>
            <div className="chart-card">
              <BarChartComponent title="Category Comparison" />
            </div>
            <div className="chart-card">
              <PieChartComponent title="Distribution" />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Interactive Dashboard - Built with React, TypeScript, Recharts & Zustand</p>
      </footer>
    </div>
  );
}

export default App;
