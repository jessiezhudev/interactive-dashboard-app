import React, { useState, useMemo } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Brush, 
  ReferenceArea,
  Area,
  AreaChart
} from 'recharts';
import type { TimeSeriesData } from '../store/dashboardStore';

interface LineChartProps {
  data: TimeSeriesData[];
  onDataPointClick?: (time: string) => void;
}

const LineChart: React.FC<LineChartProps> = React.memo(({ data, onDataPointClick }) => {
  const { start, end } = usePerformanceMonitor('LineChart', 300);
  start();


  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [brushExtent, setBrushExtent] = useState<[number, number] | null>(null);

  const handleClick = (data: any) => {
    if (onDataPointClick && data.activePayload && data.activePayload.length > 0) {
      const selectedTime = data.activePayload[0].payload.time;
      onDataPointClick(selectedTime);
      setSelectedTime(selectedTime);
    }
  };

  const handleBrushChange = (e: any) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      setBrushExtent([e.startIndex, e.endIndex]);
    }
  };

  // Get all series keys (excluding time)
  const seriesKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'time') 
    : [];

  // Define colors for different series
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  // Virtual scroll: only render visible data points when data is large
  const visibleData = useMemo(() => {
    if (data.length <= 1000) return data;
    // Simple virtual scroll implementation: show first 500 and last 500 points
    return [...data.slice(0, 500), ...data.slice(-500)];
  }, [data]);

  const result = (
    <div className="bg-white dark:bg-gray-800 blue:bg-blue-50 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white blue:text-blue-800">Time Series Data</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart 
            data={visibleData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={handleClick}
          >
            <defs>
              {seriesKeys.map((key, index) => (
                <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
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
            {seriesKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]} 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }}
                fillOpacity={1}
                fill={`url(#color${key})`}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
            {selectedTime && (
              <ReferenceArea 
                x1={selectedTime} 
                x2={selectedTime} 
                stroke="#ef4444" 
                strokeWidth={2} 
                strokeDasharray="3 3"
              />
            )}
          </ReLineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Brush for time range selection */}
      {data.length > 10 && (
        <div className="w-full h-20 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                {seriesKeys.map((key, index) => (
                  <linearGradient key={key} id={`brushColor${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis hide />
              {seriesKeys.map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  fill={`url(#brushColor${key})`}
                />
              ))}
              <Brush 
                dataKey="time" 
                height={30} 
                stroke="#3b82f6"
                onChange={handleBrushChange}
                startIndex={brushExtent?.[0]} 
                endIndex={brushExtent?.[1]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

  end();
  return result;
}

LineChart.displayName = 'LineChart';

export default LineChart;
