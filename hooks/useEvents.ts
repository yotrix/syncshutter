import { useState, useEffect, useCallback } from 'react';
import { Event, PaymentStatus } from '../types';

const initialEvents: Event[] = [
  {
    id: '1',
    clientName: 'Alice & Bob',
    eventType: 'Wedding',
    eventStartDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    eventEndDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    location: 'Grand Hotel Ballroom',
    phone: '123-456-7890',
    payment: 3500,
    paymentStatus: PaymentStatus.Paid,
    notes: 'Bride wants a lot of candid shots. Bring the 85mm lens.',
    needsVideography: true,
    videographyStartDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    videographyEndDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
  },
  {
    id: '2',
    clientName: 'Charlie\'s 5th Birthday',
    eventType: 'Birthday',
    eventStartDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
    eventEndDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
    location: 'City Park Pavilion',
    phone: '098-765-4321',
    payment: 800,
    paymentStatus: PaymentStatus.Pending,
    notes: 'Outdoor event, check weather forecast. The theme is superheroes.',
    needsVideography: false,
  },
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      // If there are saved events, use them. Otherwise, check if it's the first time and use initialEvents.
      if (savedEvents) {
        return JSON.parse(savedEvents);
      }
      // Use a flag to ensure initialEvents are only loaded once
      if (!localStorage.getItem('events_initialized')) {
        localStorage.setItem('events_initialized', 'true');
        return initialEvents;
      }
      return []; // Default to empty array if initialized but no events
    } catch (error) {
      console.error("Error reading events from localStorage", error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false); // No real loading, but keep for API consistency

  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error("Error saving events to localStorage", error);
    }
  }, [events]);

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: new Date().toISOString() };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvents(prev => prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);
  
  const updateEventsByEventType = useCallback((oldType: string, newType: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.eventType === oldType ? { ...event, eventType: newType } : event
      )
    );
  }, []);

  const deleteEventsByEventType = useCallback((deletedType: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.eventType === deletedType ? { ...event, eventType: 'Other' } : event
      )
    );
  }, []);

  return { events, loading, addEvent, updateEvent, deleteEvent, updateEventsByEventType, deleteEventsByEventType };
};