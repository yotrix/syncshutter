import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Event, PaymentStatus } from '../types';
import EventForm from './EventForm';
import { useEventTypes } from '../hooks/useEventTypes';
import { VideoCameraIcon, PhotoCameraIcon, ArrowUpIcon, ArrowDownIcon, ChevronUpDownIcon } from './Icons';
import EventDetailsModal from './EventDetailsModal';

type SortDirection = 'ascending' | 'descending';
type SortKey = 'clientName' | 'eventStartDate' | 'payment';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const EventList: React.FC = () => {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
  const { eventTypes } = useEventTypes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'eventStartDate', direction: 'descending' });

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        const searchText = filterText.toLowerCase();
        return (
          event.clientName.toLowerCase().includes(searchText) ||
          event.location.toLowerCase().includes(searchText)
        );
      })
      .filter(event => filterType === 'all' || event.eventType === filterType)
      .filter(event => filterStatus === 'all' || event.paymentStatus === filterStatus);
  }, [events, filterText, filterType, filterStatus]);

  const sortedEvents = useMemo(() => {
    let sortableItems = [...filteredEvents];
    sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else if (sortConfig.key === 'eventStartDate') {
            comparison = new Date(valA as string).getTime() - new Date(valB as string).getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
            comparison = valA.localeCompare(valB);
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
    return sortableItems;
  }, [filteredEvents, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    } else if (sortConfig.key !== key) {
        if (key === 'eventStartDate' || key === 'payment') {
            direction = 'descending';
        }
    }
    setSortConfig({ key, direction });
  };

  const handleAdd = () => {
    setEventToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const handleDelete = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  const handleSave = (event: Event) => {
    if (eventToEdit) {
      updateEvent(event);
    } else {
      addEvent(event);
    }
    setIsFormOpen(false);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const datePart = startDate.toLocaleDateString('en-US', options);

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
    const endTime = endDate.toLocaleTimeString('en-US', timeOptions);
    
    if (startDate.toDateString() !== endDate.toDateString()) {
      return `${startDate.toLocaleString('en-US', {...options, ...timeOptions})} - ${endDate.toLocaleString('en-US', {...options, ...timeOptions})}`
    }

    return `${datePart}, ${startTime} - ${endTime}`;
  }

  const SortableHeader: React.FC<{ columnKey: SortKey, title: string }> = ({ columnKey, title }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        <button onClick={() => requestSort(columnKey)} className="group inline-flex items-center gap-1 text-inherit font-medium">
            {title}
            <span className="opacity-50 group-hover:opacity-100 transition-opacity">
            {sortConfig.key === columnKey
                ? (sortConfig.direction === 'ascending' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />)
                : <ChevronUpDownIcon className="h-4 w-4" />
            }
            </span>
        </button>
    </th>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Events</h1>
        <button onClick={handleAdd} className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700">
          Add New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <input type="text" placeholder="Search by client or location..." value={filterText} onChange={e => setFilterText(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm sm:text-sm" />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm sm:text-sm">
          <option value="all">All Event Types</option>
          {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as PaymentStatus | 'all')} className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm sm:text-sm">
          <option value="all">All Payment Statuses</option>
          {Object.values(PaymentStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {loading ? <p>Loading events...</p> : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <SortableHeader columnKey="clientName" title="Client / Event" />
                <SortableHeader columnKey="eventStartDate" title="Date & Time" />
                <SortableHeader columnKey="payment" title="Payment" />
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedEvents.map(event => (
                <tr 
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.clientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.eventType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <PhotoCameraIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{formatDateRange(event.eventStartDate, event.eventEndDate)}</span>
                    </div>
                    {event.needsVideography && event.videographyStartDate && event.videographyEndDate && (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-1">
                            <VideoCameraIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{formatDateRange(event.videographyStartDate, event.videographyEndDate)}</span>
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{formatCurrency(event.payment)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.paymentStatus === PaymentStatus.Paid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {event.paymentStatus}
                    </span>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => handleEdit(event)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sortedEvents.length === 0 && !loading && <p className="text-center py-8 text-gray-500 dark:text-gray-400">No events found.</p>}
      {isFormOpen && <EventForm eventToEdit={eventToEdit} onSave={handleSave} onClose={() => setIsFormOpen(false)} />}
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default EventList;