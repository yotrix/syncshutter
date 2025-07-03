import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EventList from './components/EventList';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import AuthLayout from './components/AuthLayout';

const AppContent: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();
  const location = useLocation();
  const showHeader = location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {showHeader && <Header theme={theme} toggleTheme={toggleTheme} />}
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Dashboard theme={theme} />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
