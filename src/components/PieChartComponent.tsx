import React, { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboardStore } from '../store/dashboardStore';
import type { PieData } from '../types';
import html2canvas from 'html2canvas';

interface PieChartComponentProps {
  title?: string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ title = 'Category Distribution' }) => {
  const { pieData, filters, setFilters, theme } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);

  // Handle click on pie slice
  const handlePieClick = (data: PieData) => {
    setFilters({ selectedCategory: data.name });
  };

  // Export chart as PNG
  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `pie-chart-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
      alert('Failed to export chart. Please try again.');
    }
  };

  // Get colors for pie slices
  const getPieColor = (name: string) => {
    const colors: Record<string, string> = {
      A: '#3b82f6',
      B: '#8b5cf6',
      C: '#ec4899',
      D: '#f59e0b'
    };
    return colors[name] || '#6b7280';
  };

  // Check if slice is selected
  const isSliceSelected = (name: string) => {
    return filters.selectedCategory === name;
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
        {pieData.length === 0 ? (
          <div className="chart-placeholder">
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                onClick={handlePieClick}
                cursor="pointer"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getPieColor(entry.name)}
                    fillOpacity={isSliceSelected(entry.name) ? 1 : 0.8}
                    stroke={isSliceSelected(entry.name) ? '#ffffff' : 'none'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}`, 'Count']}
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
                iconType="circle"
                textStyle={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <style jsx>{`
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
          display: flex;
          align-items: center;
          justify-content: center;
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

export default PieChartComponent;
