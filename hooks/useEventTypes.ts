import { useState, useEffect, useCallback } from 'react';

const defaultEventTypes = [
  "Wedding", "Birthday", "Baby Shower", "Housewarming", "Half Saree", "Corporate", "Other",
];

export const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState<string[]>(() => {
    try {
      const savedTypes = localStorage.getItem('eventTypes');
      return savedTypes ? JSON.parse(savedTypes) : defaultEventTypes;
    } catch (error) {
      console.error("Error reading event types from localStorage", error);
      return defaultEventTypes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eventTypes', JSON.stringify(eventTypes));
    } catch (error) {
      console.error("Error saving event types to localStorage", error);
    }
  }, [eventTypes]);

  const addEventType = useCallback((newType: string) => {
    if (newType && !eventTypes.find(t => t.toLowerCase() === newType.toLowerCase())) {
        const updatedTypes = [...eventTypes, newType].sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));
        setEventTypes(updatedTypes);
    }
  }, [eventTypes]);

  const updateEventType = useCallback((oldType: string, newType: string) => {
    const updatedTypes = eventTypes.map(t => (t === oldType ? newType : t)).sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));
    setEventTypes(updatedTypes);
  }, [eventTypes]);

  const deleteEventType = useCallback((typeToDelete: string) => {
    if (typeToDelete === 'Other') return;
    const updatedTypes = eventTypes.filter(t => t !== typeToDelete);
    setEventTypes(updatedTypes);
  }, [eventTypes]);

  return { eventTypes, addEventType, updateEventType, deleteEventType };
};