import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../store';

type BarChartProps = {
  title: string;
};

const BarChartComponent: React.FC<BarChartProps> = ({ title }) => {
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

  // Prepare data for bar chart
  const getBarChartData = () => {
    if (selectedDataPoint) {
      // If a data point is selected, show data for that category
      const filteredData = timeSeriesData.filter(item => item.category === selectedDataPoint.category);
      return filteredData.map(item => ({
        date: item.date,
        value: item.value
      }));
    } else {
      // If no data point is selected, show average value per category
      const categoryMap: { [key: string]: number[] } = {};
      timeSeriesData.forEach(item => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = [];
        }
        categoryMap[item.category].push(item.value);
      });
      return Object.entries(categoryMap).map(([category, values]) => ({
        name: category,
        value: values.reduce((sum, val) => sum + val, 0) / values.length
      }));
    }
  };

  const barChartData = getBarChartData();

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
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey={selectedDataPoint ? 'date' : 'name'} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar dataKey="value" fill="#0088fe" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
