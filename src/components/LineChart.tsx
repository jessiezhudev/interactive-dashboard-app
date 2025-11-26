import React, { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { useDashboardStore } from '../store';

type LineChartProps = {
  title: string;
};

const LineChartComponent: React.FC<LineChartProps> = ({ title }) => {
  const { timeSeriesData, selectedDataPoint, selectDataPoint } = useDashboardStore();
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
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0088fe"
              strokeWidth={2}
              dot={({ r, fill, stroke, strokeWidth, ...rest }: any) => (
                <circle
                  cx={0}
                  cy={0}
                  r={r || 6}
                  fill={fill || '#0088fe'}
                  stroke={stroke || '#0088fe'}
                  strokeWidth={strokeWidth || 1}
                  onClick={() => rest.index !== undefined && selectDataPoint(timeSeriesData[rest.index])}
                />
              )}
            />
            {selectedDataPoint && (
              <ReferenceLine
                x={selectedDataPoint.date}
                stroke="red"
                strokeDasharray="3 3"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;
