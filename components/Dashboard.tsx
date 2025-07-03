import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { PaymentStatus, Event } from '../types';
import StatCard from './StatCard';
import { CalendarIcon, MoneyIcon, UsersIcon } from './Icons';
import MonthlyEarningsChart from './MonthlyEarningsChart';
import EventDetailsModal from './EventDetailsModal';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className }) => {
  return (
    <div className={`${className || ''} bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col`}>
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6 pt-2 flex-grow">
        {children}
      </div>
    </div>
  );
};

interface DashboardProps {
  theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const upcomingEvents = events.filter(e => new Date(e.eventStartDate) > now);
  
  const monthlyEarnings = events
    .filter(e => {
      const eventDate = new Date(e.eventStartDate);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear &&
        e.paymentStatus === PaymentStatus.Paid
      );
    })
    .reduce((sum, e) => sum + e.payment, 0);

  const yearlyEarnings = events
    .filter(e => {
        const eventDate = new Date(e.eventStartDate);
        return (
            eventDate.getFullYear() === currentYear &&
            e.paymentStatus === PaymentStatus.Paid
        );
    })
    .reduce((sum, e) => sum + e.payment, 0);

  const pendingPayments = events.filter(e => e.paymentStatus === PaymentStatus.Pending);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const datePart = startDate.toLocaleDateString('en-US', options);

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
    const endTime = endDate.toLocaleTimeString('en-US', timeOptions);
    
    return `${datePart}, ${startTime} - ${endTime}`;
  }
  
  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Upcoming Events" value={upcomingEvents.length} icon={<CalendarIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />} />
        <StatCard title="This Month's Earnings" value={formatCurrency(monthlyEarnings)} icon={<MoneyIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />} />
        <StatCard title="This Year's Earnings" value={formatCurrency(yearlyEarnings)} icon={<MoneyIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />} />
        <StatCard title="Pending Payments" value={pendingPayments.length} icon={<UsersIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />} />
      </div>

      {/* Main Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="Monthly Earnings (Last 12 Months)" className="lg:col-span-2">
           <div className="h-96"><MonthlyEarningsChart events={events} theme={theme} /></div>
        </DashboardCard>

        <DashboardCard title="Upcoming Shoots">
            <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
                [...upcomingEvents]
                .sort((a,b) => new Date(a.eventStartDate).getTime() - new Date(b.eventStartDate).getTime())
                .slice(0, 5)
                .map(event => (
                    <div 
                    key={event.id} 
                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                    >
                    <div className="bg-primary-100 dark:bg-gray-700 p-3 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{event.clientName} - {event.eventType}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateRange(event.eventStartDate, event.eventEndDate)}</p>
                    </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No upcoming events. Time to relax!</p>
            )}
            </div>
        </DashboardCard>

        <DashboardCard title="Pending Payments">
            <div className="space-y-4">
            {pendingPayments.length > 0 ? (
                pendingPayments.map(event => (
                <div key={event.id} className="flex justify-between items-center">
                    <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{event.clientName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.eventType}</p>
                    </div>
                    <p className="font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(event.payment)}</p>
                </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">All payments are up to date. Great job!</p>
            )}
            </div>
        </DashboardCard>
      </div>
      
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default Dashboard;