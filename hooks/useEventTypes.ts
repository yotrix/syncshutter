import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const defaultEventTypes = [
  "Wedding", "Birthday", "Baby Shower", "Housewarming", "Half Saree", "Corporate", "Other",
];

export const useEventTypes = () => {
  const { user } = useAuth();
  const getTypesKey = useCallback(() => user ? `eventTypes_${user.email}` : null, [user]);

  const [eventTypes, setEventTypes] = useState<string[]>([]);
  
  useEffect(() => {
    const typesKey = getTypesKey();
    if (!typesKey) {
        setEventTypes([]);
        return;
    }

    try {
      const savedTypes = localStorage.getItem(typesKey);
      setEventTypes(savedTypes ? JSON.parse(savedTypes) : defaultEventTypes);
    } catch (error) {
      console.error("Error reading event types from localStorage", error);
      setEventTypes(defaultEventTypes);
    }
  }, [user, getTypesKey]);

  useEffect(() => {
    const typesKey = getTypesKey();
    if (typesKey) {
      try {
        localStorage.setItem(typesKey, JSON.stringify(eventTypes));
      } catch (error) {
        console.error("Error saving event types to localStorage", error);
      }
    }
  }, [eventTypes, user, getTypesKey]);

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