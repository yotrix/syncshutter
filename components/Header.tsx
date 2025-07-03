import React from 'react';
import { NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon, UsersIcon } from './Icons';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const navLinkClasses = 'px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  const activeNavLinkClasses = 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-white';

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`;

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <UsersIcon className="h-8 w-8 text-primary-600"/>
              <span className="font-bold text-xl text-gray-800 dark:text-white">ShutterSync</span>
            </div>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/" className={getNavLinkClass} end>
                  Dashboard
                </NavLink>
                <NavLink to="/events" className={getNavLinkClass}>
                  All Events
                </NavLink>
                <NavLink to="/calendar" className={getNavLinkClass}>
                  Calendar
                </NavLink>
                <NavLink to="/settings" className={getNavLinkClass}>
                  Settings
                </NavLink>
              </div>
            </nav>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
       <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-around">
          <NavLink to="/" className={getNavLinkClass} end>Dashboard</NavLink>
          <NavLink to="/events" className={getNavLinkClass}>Events</NavLink>
          <NavLink to="/calendar" className={getNavLinkClass}>Calendar</NavLink>
          <NavLink to="/settings" className={getNavLinkClass}>Settings</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;