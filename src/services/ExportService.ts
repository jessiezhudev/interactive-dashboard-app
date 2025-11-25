import type { RawData, TimeSeriesData, CategoryData, PieData } from '../store/dashboardStore';

/**
 * Export service for exporting data and charts
 */
export class ExportService {
  /**
   * Export data as CSV
   * @param data Data to export
   * @param filename Filename without extension
   */
  static exportAsCSV(data: any[], filename: string): void {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export data as JSON
   * @param data Data to export
   * @param filename Filename without extension
   */
  static exportAsJSON(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export chart as PNG
   * @param chartId Chart container ID
   * @param filename Filename without extension
   */
  static async exportChartAsPNG(chartId: string, filename: string): Promise<void> {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;

    // This is a placeholder - actual implementation would use html2canvas or similar
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText('Chart Export', 350, 300);

      const pngData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngData;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Export chart as SVG
   * @param chartId Chart container ID
   * @param filename Filename without extension
   */
  static exportChartAsSVG(chartId: string, filename: string): void {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;

    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export all charts and data
   * @param data Data to export
   */
  static exportAll(data: { rawData: RawData[]; timeSeriesData: TimeSeriesData[]; categoryData: CategoryData[]; pieData: PieData[] }): void {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const baseFilename = `dashboard-export-${timestamp}`;

    // Export data files
    this.exportAsCSV(data.rawData, `${baseFilename}-raw`);
    this.exportAsCSV(data.timeSeriesData, `${baseFilename}-time-series`);
    this.exportAsCSV(data.categoryData, `${baseFilename}-category`);
    this.exportAsCSV(data.pieData, `${baseFilename}-pie`);

    // Export JSON files
    this.exportAsJSON(data.rawData, `${baseFilename}-raw`);

    // Export charts (placeholder)
    ['line-chart', 'bar-chart', 'pie-chart'].forEach((chartId, index) => {
      setTimeout(() => {
        this.exportChartAsPNG(chartId, `${baseFilename}-chart-${index + 1}`);
      }, 100 * index);
    });
  }
}
