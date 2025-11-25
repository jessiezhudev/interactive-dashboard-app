import React from 'react';
import type { Theme } from '../store/dashboardStore';
import { useDashboardStore } from '../store/dashboardStore';

const ThemeSwitcher: React.FC = React.memo(() => {
  const { theme, setTheme } = useDashboardStore();

  const themes: { value: Theme; label: string; color: string }[] = [
    { value: 'light', label: 'Light', color: '#fbbf24' },
    { value: 'dark', label: 'Dark', color: '#1f2937' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 blue:text-blue-700">Theme:</label>
      <div className="flex gap-1">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              theme === t.value
                ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600 blue:ring-blue-400 scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: t.color }}
            aria-label={t.label}
          >
            <span className="text-white font-bold text-xs">{t.label.charAt(0)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';

export default React.memo(ThemeSwitcher);
