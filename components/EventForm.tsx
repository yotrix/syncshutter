import React, { useState, useEffect } from 'react';
import { Event, PaymentStatus } from '../types';
import { useEventTypes } from '../hooks/useEventTypes';

interface EventFormProps {
  eventToEdit?: Event | null;
  onSave: (event: Event) => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onSave, onClose }) => {
  const { eventTypes } = useEventTypes();
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    clientName: '',
    eventType: eventTypes[0] || 'Other',
    eventStartDate: '',
    eventEndDate: '',
    location: '',
    phone: '',
    payment: 0,
    paymentStatus: PaymentStatus.Pending,
    notes: '',
    needsVideography: false,
    videographyStartDate: '',
    videographyEndDate: '',
  });

  const toDatetimeLocal = (isoString?: string) => isoString ? new Date(isoString).toISOString().slice(0, 16) : '';

  useEffect(() => {
    if (eventToEdit) {
      const eventTypeExists = eventTypes.includes(eventToEdit.eventType);
      setFormData({
        ...eventToEdit,
        eventType: eventTypeExists ? eventToEdit.eventType : (eventTypes[0] || 'Other'),
        eventStartDate: toDatetimeLocal(eventToEdit.eventStartDate),
        eventEndDate: toDatetimeLocal(eventToEdit.eventEndDate),
        videographyStartDate: toDatetimeLocal(eventToEdit.videographyStartDate),
        videographyEndDate: toDatetimeLocal(eventToEdit.videographyEndDate),
      });
    } else {
      // For new events, default to the first type in the list
      setFormData(prev => ({ ...prev, eventType: eventTypes[0] || 'Other' }));
    }
  }, [eventToEdit, eventTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
            videographyStartDate: !checked ? '' : prev.videographyStartDate,
            videographyEndDate: !checked ? '' : prev.videographyEndDate,
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'payment' ? Number(value) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: eventToEdit?.id || new Date().toISOString(),
      eventStartDate: new Date(formData.eventStartDate).toISOString(),
      eventEndDate: new Date(formData.eventEndDate).toISOString(),
      videographyStartDate: formData.needsVideography && formData.videographyStartDate ? new Date(formData.videographyStartDate).toISOString() : undefined,
      videographyEndDate: formData.needsVideography && formData.videographyEndDate ? new Date(formData.videographyEndDate).toISOString() : undefined,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {eventToEdit ? 'Edit Event' : 'Add New Event'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
                <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
                <select name="eventType" id="eventType" value={formData.eventType} onChange={handleChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="eventStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photography Start Time</label>
                <input type="datetime-local" name="eventStartDate" id="eventStartDate" value={formData.eventStartDate} onChange={handleChange} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="eventEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photography End Time</label>
                <input type="datetime-local" name="eventEndDate" id="eventEndDate" value={formData.eventEndDate} onChange={handleChange} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="payment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Amount ($)</label>
                <input type="number" name="payment" id="payment" value={formData.payment} onChange={handleChange} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Status</label>
                <select name="paymentStatus" id="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  {Object.values(PaymentStatus).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 space-y-4">
                 <div className="flex items-center gap-3">
                    <input type="checkbox" name="needsVideography" id="needsVideography" checked={formData.needsVideography} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary-600 focus:ring-primary-500"/>
                    <label htmlFor="needsVideography" className="text-sm font-medium text-gray-700 dark:text-gray-300">Needs Videography?</label>
                </div>

                {formData.needsVideography && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                       <div>
                           <label htmlFor="videographyStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Videography Start Time</label>
                           <input type="datetime-local" name="videographyStartDate" id="videographyStartDate" value={formData.videographyStartDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
                       </div>
                       <div>
                           <label htmlFor="videographyEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Videography End Time</label>
                           <input type="datetime-local" name="videographyEndDate" id="videographyEndDate" value={formData.videographyEndDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
                       </div>
                   </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes & Reminders</label>
                <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;