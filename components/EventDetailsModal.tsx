import React from 'react';
import { Event } from '../types';

interface EventDetailsModalProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const datePart = startDate.toLocaleDateString('en-US', options);

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
    const endTime = endDate.toLocaleTimeString('en-US', timeOptions);
    
    if (startDate.toDateString() !== endDate.toDateString()) {
      return `${startDate.toLocaleString('en-US', {...options, ...timeOptions})} - ${endDate.toLocaleString('en-US', {...options, ...timeOptions})}`
    }

    return `${datePart}, ${startTime} - ${endTime}`;
  }

  const formatTimeRange = (start: string, end: string) => {
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const startTime = new Date(start).toLocaleTimeString('en-US', timeOptions);
    const endTime = new Date(end).toLocaleTimeString('en-US', timeOptions);
    return `${startTime} - ${endTime}`;
  }

  const getGoogleCalendarLink = (event: Event) => {
    const startTime = new Date(event.eventStartDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime = new Date(event.eventEndDate).toISOString().replace(/-|:|\.\d\d\d/g, "");

    let videoDetails = 'No';
    if (event.needsVideography && event.videographyStartDate && event.videographyEndDate) {
        videoDetails = `Yes, from ${formatTimeRange(event.videographyStartDate, event.videographyEndDate)}`
    }
    
    let detailsParts = [
        `Client: ${event.clientName}`,
        `Phone: ${event.phone}`,
        `Payment: $${event.payment} (${event.paymentStatus})`,
        `Videography: ${videoDetails}`
    ];
    if (event.notes) {
        detailsParts.push(`\nNotes:\n${event.notes}`);
    }

    const details = detailsParts.join('\n');

    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', `${event.eventType}: ${event.clientName}`);
    url.searchParams.append('dates', `${startTime}/${endTime}`);
    url.searchParams.append('details', details);
    url.searchParams.append('location', event.location);
    return url.toString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.eventType}: {event.clientName}</h3>
          
          <div className="text-sm text-gray-600 dark:text-gray-300">
             <p className="font-semibold text-gray-700 dark:text-gray-200">Photography:</p>
             <p>{formatDateRange(event.eventStartDate, event.eventEndDate)}</p>
          </div>
          
          {event.needsVideography && event.videographyStartDate && event.videographyEndDate && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-700 dark:text-gray-200">Videography:</p>
                <p>{formatDateRange(event.videographyStartDate, event.videographyEndDate)}</p>
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Location:</span> {event.location}</p>
          <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Payment:</span> ${event.payment} <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${event.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{event.paymentStatus}</span></p>

          {event.notes && <div className="pt-2">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Notes:</p> 
            <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-md whitespace-pre-wrap">{event.notes}</p>
          </div>}
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
          <a href={getGoogleCalendarLink(event)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
            Add to Google Calendar
          </a>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
