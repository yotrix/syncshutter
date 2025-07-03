import React, { useState } from 'react';
import { useEventTypes } from '../hooks/useEventTypes';
import { useEvents } from '../hooks/useEvents';
import { PencilIcon, TrashIcon, PlusIcon } from './Icons';

const Settings: React.FC = () => {
  const { eventTypes, addEventType, updateEventType, deleteEventType } = useEventTypes();
  const eventsHook = useEvents();

  const [newType, setNewType] = useState('');
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  
  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType.trim()) {
      addEventType(newType.trim());
      setNewType('');
    }
  };

  const handleEditClick = (type: string) => {
    setEditingType(type);
    setEditingValue(type);
  };

  const handleCancelEdit = () => {
    setEditingType(null);
    setEditingValue('');
  };

  const handleSaveEdit = (oldType: string) => {
    if (editingValue.trim() && editingValue.trim() !== oldType) {
      updateEventType(oldType, editingValue.trim());
      eventsHook.updateEventsByEventType(oldType, editingValue.trim());
    }
    handleCancelEdit();
  };
  
  const handleDeleteType = (type: string) => {
    if (window.confirm(`Are you sure you want to delete the "${type}" event type? All events with this type will be changed to "Other".`)) {
      deleteEventType(type);
      eventsHook.deleteEventsByEventType(type);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Manage Event Types</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add, edit, or delete the event categories you use for your business. The "Other" category cannot be removed.
        </p>

        <div className="space-y-3 mb-6">
          {eventTypes.map(type => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              {editingType === type ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => handleSaveEdit(type)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(type)}
                  className="w-full bg-transparent border-b-2 border-primary-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <span className="text-gray-800 dark:text-gray-200">{type}</span>
              )}
              
              <div className="flex items-center gap-3">
                {editingType === type ? (
                  <>
                    <button onClick={() => handleSaveEdit(type)} className="text-green-500 hover:text-green-700">Save</button>
                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-700">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(type)} disabled={type === 'Other'} className="disabled:opacity-50 disabled:cursor-not-allowed text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteType(type)} disabled={type === 'Other'} className="disabled:opacity-50 disabled:cursor-not-allowed text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddType} className="flex gap-4">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Add a new event type"
            className="flex-grow w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm sm:text-sm"
          />
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 disabled:bg-primary-300" disabled={!newType.trim()}>
            <PlusIcon className="w-5 h-5" />
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
