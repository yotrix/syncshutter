import { useState, useEffect, useCallback } from 'react';
import { Event, PaymentStatus } from '../types';

const getInitialEvents = (): Event[] => {
  try {
    const item = window.localStorage.getItem('events');
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error('Error reading events from localStorage', error);
  }
  
  // Return mock data if localStorage is empty
  const tomorrowStart = new Date();
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(14, 0, 0, 0); // 2 PM
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(tomorrowStart.getHours() + 4); // 4 hour event

  const nextWeekStart = new Date();
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  nextWeekStart.setHours(10, 0, 0, 0); // 10 AM
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setHours(nextWeekStart.getHours() + 8); // 8 hour event

  const lastMonthStart = new Date();
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  lastMonthStart.setHours(9, 0, 0, 0); // 9 AM
  const lastMonthEnd = new Date(lastMonthStart);
  lastMonthEnd.setHours(lastMonthStart.getHours() + 3); // 3 hour event
  const lastMonthVideoEnd = new Date(lastMonthStart);
  lastMonthVideoEnd.setHours(lastMonthStart.getHours() + 2);

  return [
    {
      id: '1',
      clientName: 'Alice & Bob',
      eventType: "Wedding",
      eventStartDate: tomorrowStart.toISOString(),
      eventEndDate: tomorrowEnd.toISOString(),
      location: 'The Grand Ballroom',
      phone: '123-456-7890',
      payment: 3500,
      paymentStatus: PaymentStatus.Pending,
      notes: 'Golden hour shots are a must. Bring 85mm f/1.4.',
      needsVideography: true,
      videographyStartDate: tomorrowStart.toISOString(),
      videographyEndDate: tomorrowEnd.toISOString(),
    },
    {
      id: '2',
      clientName: 'Charlie Brown',
      eventType: "Birthday",
      eventStartDate: nextWeekStart.toISOString(),
      eventEndDate: nextWeekEnd.toISOString(),
      location: '123 Main St, Anytown',
      phone: '234-567-8901',
      payment: 500,
      paymentStatus: PaymentStatus.Paid,
      notes: 'Candid shots of kids playing.',
      needsVideography: false,
    },
    {
      id: '3',
      clientName: 'Diana Prince',
      eventType: "Corporate",
      eventStartDate: lastMonthStart.toISOString(),
      eventEndDate: lastMonthEnd.toISOString(),
      location: 'Wayne Enterprises HQ',
      phone: '345-678-9012',
      payment: 2000,
      paymentStatus: PaymentStatus.Paid,
      notes: 'Headshots for new employees.',
      needsVideography: true,
      videographyStartDate: lastMonthStart.toISOString(),
      videographyEndDate: lastMonthVideoEnd.toISOString(),
    },
  ];
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(getInitialEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage', error);
    }
  }, [events]);

  useEffect(() => {
    // Simulating initial load
    setLoading(false);
  }, []);

  const addEvent = useCallback((event: Event) => {
    setEvents(prevEvents => [...prevEvents, event]);
  }, []);

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvents(prevEvents =>
      prevEvents.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);

  const updateEventsByEventType = useCallback((oldType: string, newType: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event => (event.eventType === oldType ? { ...event, eventType: newType } : event))
    );
  }, []);

  const deleteEventsByEventType = useCallback((deletedType: string) => {
    // Fallback to 'Other' when an event type is deleted.
    setEvents(prevEvents =>
      prevEvents.map(event => (event.eventType === deletedType ? { ...event, eventType: 'Other' } : event))
    );
  }, []);

  return { events, loading, addEvent, updateEvent, deleteEvent, updateEventsByEventType, deleteEventsByEventType };
};