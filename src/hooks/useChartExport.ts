import { useCallback } from 'react';
import { ExportService } from '../services/ExportService';
import type { RawData, TimeSeriesData, CategoryData, PieData } from '../store/dashboardStore';

/**
 * Hook for exporting charts and data
 */
export const useChartExport = () => {
  const exportAsCSV = useCallback((data: any[], filename: string) => {
    ExportService.exportAsCSV(data, filename);
  }, []);

  const exportAsJSON = useCallback((data: any[], filename: string) => {
    ExportService.exportAsJSON(data, filename);
  }, []);

  const exportChartAsPNG = useCallback((chartId: string, filename: string) => {
    ExportService.exportChartAsPNG(chartId, filename);
  }, []);

  const exportChartAsSVG = useCallback((chartId: string, filename: string) => {
    ExportService.exportChartAsSVG(chartId, filename);
  }, []);

  const exportAll = useCallback((data: { rawData: RawData[]; timeSeriesData: TimeSeriesData[]; categoryData: CategoryData[]; pieData: PieData[] }) => {
    ExportService.exportAll(data);
  }, []);

  return {
    exportAsCSV,
    exportAsJSON,
    exportChartAsPNG,
    exportChartAsSVG,
    exportAll
  };
};
