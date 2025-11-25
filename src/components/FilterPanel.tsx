import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

import { useDashboardStore } from '../store/dashboardStore';

const FilterPanel: React.FC = React.memo(() => {
  const { filterConfig, setFilterConfig, filterData, rawData } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique values for each dimension
  const uniqueCategories = Array.from(new Set(rawData.map(item => item.category))).sort();
  const uniqueRegions = Array.from(new Set(rawData.map(item => item.region))).sort();
  const uniqueProductLines = Array.from(new Set(rawData.map(item => item.productLine))).sort();
  const uniqueTimes = Array.from(new Set(rawData.map(item => item.time))).sort();

  const handleCategoryChange = (category: string) => {
    const newCategories = filterConfig.categories.includes(category)
      ? filterConfig.categories.filter(c => c !== category)
      : [...filterConfig.categories, category];
    setFilterConfig({ categories: newCategories });
    debouncedFilterData();
  };

  const handleRegionChange = (region: string) => {
    const newRegions = filterConfig.regions.includes(region)
      ? filterConfig.regions.filter(r => r !== region)
      : [...filterConfig.regions, region];
    setFilterConfig({ regions: newRegions });
    debouncedFilterData();
  };

  const handleProductLineChange = (productLine: string) => {
    const newProductLines = filterConfig.productLines.includes(productLine)
      ? filterConfig.productLines.filter(p => p !== productLine)
      : [...filterConfig.productLines, productLine];
    setFilterConfig({ productLines: newProductLines });
    debouncedFilterData();
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setFilterConfig({ timeRange: null });
    } else {
      const [start, end] = value.split('-');
      setFilterConfig({ timeRange: [start, end] as [string, string] });
    }
    debouncedFilterData();
  };

  // Debounce filter application to 300ms
  const debouncedFilterData = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => filterData(), 300);
      };
    })(),
    [filterData]
  );

  const handleApplyFilters = () => {
    debouncedFilterData();
  };

  const handleResetFilters = () => {
    setFilterConfig({ timeRange: null, categories: [], regions: [], productLines: [] });
    setSearchQuery('');
    filterData();
  };

  const filteredCategories = uniqueCategories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRegions = uniqueRegions.filter(region =>
    region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProductLines = uniqueProductLines.filter(productLine =>
    productLine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 blue:bg-blue-50 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white blue:text-blue-900">Filters</h2>
      
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories, regions, or product lines..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Time Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 blue:text-blue-700 mb-2">
          Time Range
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          onChange={handleTimeRangeChange}
          value={filterConfig.timeRange ? filterConfig.timeRange.join('-') : 'all'}
        >
          <option value="all">All Time</option>
          {uniqueTimes.length > 0 && (
            <option value={`${uniqueTimes[0]}-${uniqueTimes[uniqueTimes.length - 1]}`}>
              Full Range
            </option>
          )}
          {/* Add more time range options as needed */}
        </select>
      </div>

      {/* Categories Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 blue:text-blue-700 mb-2">
          Categories ({filterConfig.categories.length})
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {filteredCategories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filterConfig.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-900 dark:text-white blue:text-blue-900">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regions Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 blue:text-blue-700 mb-2">
          Regions ({filterConfig.regions.length})
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {filteredRegions.map(region => (
            <label key={region} className="flex items-center">
              <input
                type="checkbox"
                checked={filterConfig.regions.includes(region)}
                onChange={() => handleRegionChange(region)}
                className="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-900 dark:text-white blue:text-blue-900">{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Lines Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 blue:text-blue-700 mb-2">
          Product Lines ({filterConfig.productLines.length})
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {filteredProductLines.map(productLine => (
            <label key={productLine} className="flex items-center">
              <input
                type="checkbox"
                checked={filterConfig.productLines.includes(productLine)}
                onChange={() => handleProductLineChange(productLine)}
                className="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-900 dark:text-white blue:text-blue-900">{productLine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 blue:hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 blue:bg-blue-100 blue:text-blue-900 blue:hover:bg-blue-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

FilterPanel.displayName = 'FilterPanel';

export default React.memo(FilterPanel);