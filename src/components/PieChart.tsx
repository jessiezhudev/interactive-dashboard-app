import React, { useState, useMemo } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector
} from 'recharts';
import type { PieData } from '../store/dashboardStore';

interface PieChartProps {
  data: PieData[];
}

const PieChart: React.FC<PieChartProps> = React.memo(({ data }) => {
  const { start, end } = usePerformanceMonitor('PieChart', 300);
  start();

  const [isDonut, setIsDonut] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const chartData = data.map((item) => ({ ...item })) as any[];

  const handleMouseEnter = (_data: any, _index: number) => {
    // Handle mouse enter if needed
  };

  const handleMouseLeave = () => {
    // Handle mouse leave if needed
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * startAngle);
    const cos = Math.cos(-RADIAN * startAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    const result = (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#374151" fontWeight="bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#374151">
          {`${value} (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );

  end();
  return result;
}

PieChart.displayName = 'PieChart';

  return (
    <div className="bg-white dark:bg-gray-800 blue:bg-blue-50 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white blue:text-blue-800">Distribution</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setIsDonut(!isDonut)}
            className={`px-3 py-1 text-sm rounded-full ${isDonut
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 blue:bg-blue-100 blue:text-blue-700 blue:hover:bg-blue-200'}`}
          >
            {isDonut ? 'Donut' : 'Pie'}
          </button>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1 text-sm rounded-full ${showLabels
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 blue:bg-blue-100 blue:text-blue-700 blue:hover:bg-blue-200'}`}
          >
            {showLabels ? 'Hide' : 'Show'} Labels
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={isDonut ? 60 : 0}
            outerRadius={80}
            label={showLabels ? ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%` : false}
            labelLine={showLabels}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
            iconType="circle"
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(PieChart);
