import React from 'react';
import { useTheme } from '~/components/contexts/ThemeContext';

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  return (
    <div className="dropdown absolute top-20 left-20">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="h-2 w-2 fill-current opacity-60 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
      >
        {themes.map((themeOption) => (
          <li key={themeOption}>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="theme-dropdown"
                className="hidden"
                value={themeOption}
                checked={theme === themeOption}
                onChange={() => handleThemeChange(themeOption)}
              />
              <span
                className={`theme-controller btn btn-sm btn-block btn-ghost justify-start ${
                  theme === themeOption ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
