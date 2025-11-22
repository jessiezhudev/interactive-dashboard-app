import React, { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useDashboardStore } from '../store/dashboardStore';
import type { TimeSeriesData } from '../types';
import html2canvas from 'html2canvas';

interface LineChartComponentProps {
  title?: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ title = 'Time Series Data' }) => {
  const { timeSeriesData, setFilters, theme } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);

  // Handle click on data point
  const handleDotClick = (data: TimeSeriesData) => {
    setFilters({ selectedTime: data.time, selectedCategory: data.category });
  };

  // Export chart as PNG
  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `line-chart-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
      alert('Failed to export chart. Please try again.');
    }
  };

  // Get color based on theme
  const getColor = () => {
    switch (theme) {
      case 'dark':
        return '#3b82f6';
      case 'blue':
        return '#10b981';
      default: // light
        return '#2563eb';
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <button
          onClick={handleExport}
          className="export-button"
          title="Export as PNG"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </button>
      </div>
      
      <div ref={chartRef} className="chart-content">
        {timeSeriesData.length === 0 ? (
          <div className="chart-placeholder">
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                stroke={theme === 'dark' ? '#d1d5db' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke={theme === 'dark' ? '#d1d5db' : '#6b7280'}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  color: theme === 'dark' ? '#ffffff' : '#1f2937'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                textStyle={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getColor()}
                strokeWidth={2}
                dot={{ r: 3, onClick: handleDotClick, cursor: 'pointer' }}
                activeDot={{ r: 5 }}
                name="Value"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <style>{`
        .chart-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          color: ${theme === 'dark' ? '#f9fafb' : '#1f2937'};
        }

        .export-button {
          background: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
          border: none;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: ${theme === 'dark' ? '#f9fafb' : '#1f2937'};
        }

        .export-button:hover {
          background: ${theme === 'dark' ? '#4b5563' : '#e5e7eb'};
          transform: translateY(-1px);
        }

        .chart-content {
          flex: 1;
          position: relative;
          border-radius: 8px;
          background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .chart-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
        }
      `}</style>
    </div>
  );
};

export default LineChartComponent;
