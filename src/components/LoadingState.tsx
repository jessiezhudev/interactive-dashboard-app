import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

interface LoadingStateProps {
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ className = '' }) => {
  const { theme } = useDashboardStore();

  return (
    <div className={`loading-container ${className}`}>
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-text">Loading data...</p>

      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem;
          background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 4rem;
          height: 4rem;
          position: relative;
        }

        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
          border-top: 4px solid ${theme === 'dark' ? '#3b82f6' : '#2563eb'};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1rem;
          font-weight: 500;
          color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
