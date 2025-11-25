import React, { useState, useMemo } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import type { CategoryData } from '../store/dashboardStore';

interface BarChartProps {
  data: CategoryData[];
}

const BarChart: React.FC<BarChartProps> = React.memo(({ data }) => {
  const { start, end } = usePerformanceMonitor('BarChart', 300);
  start();

  const [isStacked, setIsStacked] = useState(false);
  const [sortBy, setSortBy] = useState<'category' | 'value'>('category');
  const [showComparison, setShowComparison] = useState(false);

  // Get all data keys (excluding category)
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'category') 
    : [];

  // Define colors for different bars
  const colors = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    } else {
      // Sort by total value if multiple keys
      const aValue = dataKeys.reduce((sum, key) => sum + (Number(a[key]) || 0), 0);
      const bValue = dataKeys.reduce((sum, key) => sum + (Number(b[key]) || 0), 0);
      return bValue - aValue;
    }
  });

  // Generate comparison data (previous period)
  const comparisonData = showComparison ? sortedData.map(item => {
    const newItem: any = { ...item };
    dataKeys.forEach(key => {
      newItem[`${key}_prev`] = (Number(item[key]) || 0) * (0.8 + Math.random() * 0.4); // 80-120% of original
    });
    return newItem;
  }) : sortedData;

  // Get all keys including comparison keys
  const allKeys = showComparison 
    ? dataKeys.flatMap(key => [key, `${key}_prev`]) 
    : dataKeys;

  const result = (
    <div className="bg-white dark:bg-gray-800 blue:bg-blue-50 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white blue:text-blue-800">Category Data</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setIsStacked(!isStacked)}
            className={`px-3 py-1 text-sm rounded-full ${isStacked 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 blue:bg-blue-100 blue:text-blue-700 blue:hover:bg-blue-200'}`}
          >
            {isStacked ? 'Grouped' : 'Stacked'}
          </button>
          <button
            onClick={() => setSortBy(sortBy === 'category' ? 'value' : 'category')}
            className={`px-3 py-1 text-sm rounded-full ${sortBy === 'value' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 blue:bg-blue-100 blue:text-blue-700 blue:hover:bg-blue-200'}`}
          >
            Sort by {sortBy === 'category' ? 'Value' : 'Category'}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1 text-sm rounded-full ${showComparison 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 blue:bg-blue-100 blue:text-blue-700 blue:hover:bg-blue-200'}`}
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart
          data={comparisonData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          {allKeys.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key}
              stackId={isStacked ? 'a' : undefined}
              fill={colors[index % colors.length]}
              name={key.includes('_prev') ? `${key.replace('_prev', '')} (Prev)` : key.charAt(0).toUpperCase() + key.slice(1)}
            >
              {comparisonData.map((_entry, entryIndex) => (
                <Cell 
                  key={`cell-${entryIndex}-${key}`}
                  fill={key.includes('_prev') 
                    ? `${colors[index % colors.length]}80` // 50% opacity for previous period
                    : colors[index % colors.length]}
                />
              ))}
            </Bar>
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );

  end();
  return result;
}

const MemoizedBarChart = React.memo(BarChart);
MemoizedBarChart.displayName = 'BarChart';

export default MemoizedBarChart;
