import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';
import EventDetailsModal from './EventDetailsModal';

const CalendarView: React.FC = () => {
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const monthDays = daysInMonth(currentDate);
  const startDay = firstDayOfMonth(currentDate);
  const calendarDays = Array(startDay).fill(null).concat(Array.from({ length: monthDays }, (_, i) => i + 1));
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button>
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-200 w-48 text-center">{monthName}</span>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 text-center font-bold text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = day ? events.filter(e => {
              const eventDate = new Date(e.eventStartDate);
              return eventDate.getFullYear() === currentDate.getFullYear() &&
                     eventDate.getMonth() === currentDate.getMonth() &&
                     eventDate.getDate() === day;
            }) : [];
            return (
              <div key={index} className="h-28 sm:h-36 border-b border-r dark:border-gray-700 p-2 overflow-y-auto relative">
                {day && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{day}</span>}
                <div className="mt-1 space-y-1">
                  {dayEvents.map(event => (
                    <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-primary-100 dark:bg-primary-900/70 text-primary-800 dark:text-primary-200 text-xs p-1 rounded-md cursor-pointer truncate">
                      {event.clientName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

    </div>
  );
};

export default CalendarView;