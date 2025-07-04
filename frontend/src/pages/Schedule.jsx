// src/components/ScheduleEventForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ScheduleEventForm() {
  const [responseStatus, setResponseStatus] = useState(null); // 'success', 'unavailable', 'error'
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduledEvent, setScheduledEvent] = useState(null); // To display the created event

  const handleScheduleEvent = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseMessage('');
    setScheduledEvent(null);

    // Example test payload
    const requestPayload = {
      "date": "2025-07-15",
      "desiredStartTime": "14:00",
      "eventDetails": {
        "title": "Property Showing - Sunset Villa",
        "allDay": false,
        "extendedProps": {
          "type": "booking",
          "client": "Michael and Jennifer Adams",
          "clientPhone": "(555) 234-5678",
          "propertyName": "Sunset Villa",
          "description": "Meeting with Michael and Jennifer Adams for Sunset Villa.",
          "priority": "medium",
          "appointmentType": "Property Showing",
          "clientEmail": "adams.family@email.com",
          "propertyAddress": "789 Sunset Boulevard",
          "propertyPrice": "$675,000",
          "propertyType": "Single Family Home",
          "bedrooms": 3,
          "bathrooms": 2,
          "sqft": 1850,
          "estimatedDuration": 60,
          "meetingLocation": "789 Sunset Boulevard",
          "clientPreferences": "Looking for move-in ready home with large backyard",
          "leadSource": "Online listing",
          "followUpRequired": true
        }
      }
    };

    try {
      const backendUrl = 'http://localhost:5000/api/events/schedule';
      
      const response = await axios.post(backendUrl, requestPayload);
      
      setResponseStatus(response.data.status);
      setResponseMessage(response.data.message);
      if (response.data.event) {
        setScheduledEvent(response.data.event);
      }

    } catch (err) {
      console.error('Error scheduling event:', err.response ? err.response.data : err);
      setResponseStatus('error');
      if (err.response && err.response.data && err.response.data.message) {
        setResponseMessage(`Error: ${err.response.data.message}`);
      } else {
        setResponseMessage('An unexpected error occurred during scheduling.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Event Scheduling Test</h2>
      
      <button 
        onClick={handleScheduleEvent} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Scheduling...' : 'Test Schedule Event'}
      </button>

      {responseStatus && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '4px',
          backgroundColor: responseStatus === 'success' ? '#d4edda' : 
                          responseStatus === 'unavailable' ? '#fff3cd' : '#f8d7da',
          border: `1px solid ${responseStatus === 'success' ? '#c3e6cb' : 
                                responseStatus === 'unavailable' ? '#ffeaa7' : '#f5c6cb'}`,
          color: responseStatus === 'success' ? '#155724' : 
                 responseStatus === 'unavailable' ? '#856404' : '#721c24'
        }}>
          <strong>Status: {responseStatus}</strong>
          <p>{responseMessage}</p>
        </div>
      )}

      {scheduledEvent && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <h3>Scheduled Event Details:</h3>
          <pre style={{ 
            background: '#e9ecef', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify(scheduledEvent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ScheduleEventForm;