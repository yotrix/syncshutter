import { useState, useEffect, useCallback } from 'react';

const EVENT_TYPES_KEY = 'eventTypes';

const defaultEventTypes = [
  "Wedding",
  "Birthday",
  "Baby Shower",
  "Housewarming",
  "Half Saree",
  "Corporate",
  "Other",
];

const getInitialEventTypes = (): string[] => {
  try {
    const item = window.localStorage.getItem(EVENT_TYPES_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.every(i => typeof i === 'string')) {
        // Ensure 'Other' always exists as a fallback.
        if (!parsed.includes('Other')) {
          return [...parsed, 'Other'];
        }
        return parsed;
      }
    }
  } catch (error) {
    console.error(`Error reading ${EVENT_TYPES_KEY} from localStorage`, error);
  }
  return defaultEventTypes;
};

export const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState<string[]>(getInitialEventTypes);

  useEffect(() => {
    try {
      localStorage.setItem(EVENT_TYPES_KEY, JSON.stringify(eventTypes));
    } catch (error) {
      console.error(`Error saving ${EVENT_TYPES_KEY} to localStorage`, error);
    }
  }, [eventTypes]);

  const addEventType = useCallback((newType: string) => {
    if (newType && !eventTypes.find(t => t.toLowerCase() === newType.toLowerCase())) {
      setEventTypes(prev => [...prev, newType].sort((a,b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b)));
    }
  }, [eventTypes]);

  const updateEventType = useCallback((oldType: string, newType: string) => {
    setEventTypes(prev => prev.map(t => (t === oldType ? newType : t)).sort((a,b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b)));
  }, []);

  const deleteEventType = useCallback((typeToDelete: string) => {
    // Prevent deleting the 'Other' type.
    if (typeToDelete === 'Other') return;
    setEventTypes(prev => prev.filter(t => t !== typeToDelete));
  }, []);

  return { eventTypes, addEventType, updateEventType, deleteEventType };
};
