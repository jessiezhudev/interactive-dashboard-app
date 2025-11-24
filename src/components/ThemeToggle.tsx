import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import type { Theme } from '../types';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useDashboardStore();

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'blue', label: 'Blue', icon: '💙' }
  ];

  return (
    <div className={`theme-toggle-container ${className}`}>
      <span className="theme-toggle-label">Theme:</span>
      <div className="theme-buttons">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`theme-button ${theme === t.value ? 'active' : ''}`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <style>{`
        .theme-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-toggle-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: ${theme === 'dark' ? '#d1d5db' : '#6b7280'};
        }

        .theme-buttons {
          display: flex;
          gap: 0.25rem;
          background: ${theme === 'dark' ? '#374151' : '#e5e7eb'};
          padding: 0.25rem;
          border-radius: 9999px;
        }

        .theme-button {
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 9999px;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .theme-button:hover {
          background: ${theme === 'dark' ? '#4b5563' : '#d1d5db'};
          transform: scale(1.05);
        }

        .theme-button.active {
          background: ${theme === 'dark' ? '#f9fafb' : '#1f2937'};
          color: ${theme === 'dark' ? '#1f2937' : '#f9fafb'};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transform: scale(1.1);
        }

        .theme-button.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;
