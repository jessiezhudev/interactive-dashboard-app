import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Failed to load data. Please try again.', 
  onRetry, 
  className = '' 
}) => {
  const { theme } = useDashboardStore();

  return (
    <div className={`error-container ${className}`}>
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div className="error-content">
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="retry-button"
          >
            Retry
          </button>
        )}
      </div>

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 3rem;
          background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-icon {
          color: ${theme === 'dark' ? '#f87171' : '#ef4444'};
        }

        .error-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .error-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          color: ${theme === 'dark' ? '#f9fafb' : '#1f2937'};
        }

        .error-message {
          font-size: 1rem;
          color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
          margin: 0;
          max-width: 400px;
        }

        .retry-button {
          background: ${theme === 'dark' ? '#3b82f6' : '#2563eb'};
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .retry-button:hover {
          background: ${theme === 'dark' ? '#2563eb' : '#1d4ed8'};
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .retry-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ErrorState;
