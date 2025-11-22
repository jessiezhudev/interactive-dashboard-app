import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

interface FilterPanelProps {
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className = '' }) => {
  const { filters, clearFilters, timeSeriesData, theme } = useDashboardStore();

  // Get unique categories
  const categories = [...new Set(timeSeriesData.map(d => d.category))].sort();

  // Get recent times (last 5)
  const recentTimes = [...new Set(timeSeriesData.map(d => d.time))]
    .sort()
    .reverse()
    .slice(0, 5);

  const hasActiveFilters = !!filters.selectedCategory || !!filters.selectedTime;

  return (
    <div className={`filter-panel ${className}`}>
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="clear-filters-button"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-content">
        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <div className="filter-options">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (filters.selectedCategory === category) {
                    clearFilters();
                  } else {
                    useDashboardStore.getState().setFilters({ selectedCategory: category });
                  }
                }}
                className={`filter-option ${filters.selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        {recentTimes.length > 0 && (
          <div className="filter-group">
            <label className="filter-label">Recent Times</label>
            <div className="filter-options">
              {recentTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    if (filters.selectedTime === time) {
                      clearFilters();
                    } else {
                      useDashboardStore.getState().setFilters({ selectedTime: time });
                    }
                  }}
                  className={`filter-option ${filters.selectedTime === time ? 'active' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .filter-panel {
          background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .filter-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          color: ${theme === 'dark' ? '#f9fafb' : '#1f2937'};
        }

        .clear-filters-button {
          background: ${theme === 'dark' ? '#ef4444' : '#fef2f2'};
          color: ${theme === 'dark' ? '#ffffff' : '#dc2626'};
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filters-button:hover {
          background: ${theme === 'dark' ? '#dc2626' : '#fee2e2'};
          transform: translateY(-1px);
        }

        .filter-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: ${theme === 'dark' ? '#d1d5db' : '#6b7280'};
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-option {
          background: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
          color: ${theme === 'dark' ? '#f9fafb' : '#1f2937'};
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .filter-option:hover {
          background: ${theme === 'dark' ? '#4b5563' : '#e5e7eb'};
          transform: translateY(-1px);
        }

        .filter-option.active {
          background: ${theme === 'dark' ? '#3b82f6' : '#2563eb'};
          color: #ffffff;
        }

        .filter-option.active:hover {
          background: ${theme === 'dark' ? '#2563eb' : '#1d4ed8'};
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;
