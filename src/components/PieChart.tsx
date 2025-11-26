import React, { useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../store';

type PieChartProps = {
  title: string;
};

const COLORS = ['#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

const PieChartComponent: React.FC<PieChartProps> = ({ title }) => {
  const { timeSeriesData, selectedDataPoint } = useDashboardStore();
  const chartRef = useRef<HTMLDivElement>(null);

  // Function to export chart as PNG
  const exportChart = () => {
    if (!chartRef.current) return;
    const chartElement = chartRef.current.querySelector('svg');
    if (!chartElement) return;

    // Convert SVG to PNG
    const svgData = new XMLSerializer().serializeToString(chartElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title}-chart.png`;
      link.href = pngData;
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  // Prepare data for pie chart
  const getPieChartData = () => {
    if (selectedDataPoint) {
      // If a data point is selected, show breakdown for that specific point
      return [
        { name: selectedDataPoint.category, value: selectedDataPoint.percentage },
        { name: 'Others', value: 100 - selectedDataPoint.percentage }
      ];
    } else {
      // If no data point is selected, show overall distribution
      const categoryMap: { [key: string]: number } = {};
      timeSeriesData.forEach(item => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = 0;
        }
        categoryMap[item.category] += item.percentage;
      });
      const total = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
      return Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: (value / total) * 100
      }));
    }
  };

  const pieChartData = getPieChartData();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <button
          onClick={exportChart}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
        >
          Export PNG
        </button>
      </div>
      <div ref={chartRef} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : '0.0'}%`}
            >
              {pieChartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;
