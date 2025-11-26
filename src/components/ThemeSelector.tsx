import React from 'react';
import { useDashboardStore } from '../store';

type Theme = 'light' | 'dark' | 'blue';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useDashboardStore();

  const themes: { [key in Theme]: { label: string; color: string } } = {
    light: { label: 'Light', color: '#f0f0f0' },
    dark: { label: 'Dark', color: '#333333' },
    blue: { label: 'Blue', color: '#1e3a8a' }
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      {Object.entries(themes).map(([key, value]) => (
        <button
          key={key}
          onClick={() => setTheme(key as Theme)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${theme === key ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
          style={{ backgroundColor: value.color, color: key === 'dark' || key === 'blue' ? 'white' : 'black' }}
        >
          {value.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
