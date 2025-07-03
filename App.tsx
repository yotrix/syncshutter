import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EventList from './components/EventList';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;