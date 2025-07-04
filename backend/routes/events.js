const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

async function checkBrokerAvailability(dateInput, desiredStartTimeStr) {
  const desiredStartDateTime = new Date(dateInput);
  const [hours, minutes] = desiredStartTimeStr.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid desired start time string format. Expected 'HH:MM'.");
  }

  desiredStartDateTime.setHours(hours, minutes, 0, 0); // Set time, and keep date portion

  if (isNaN(desiredStartDateTime.getTime())) {
    throw new Error("Invalid date input provided.");
  }

  const desiredEndDateTime = new Date(desiredStartDateTime);
  desiredEndDateTime.setHours(desiredEndDateTime.getHours() + 1); // 1 hour duration

  if (desiredStartDateTime >= desiredEndDateTime) {
    throw new Error("Calculated end time is not after start time. Check date and time inputs.");
  }

  try {
    const query = {
      'extendedProps.type': { $in: ['booking', 'out_of_office'] },
      $and: [
        { start: { $lt: desiredEndDateTime } },   // Existing event starts before desired ends
        { end: { $gt: desiredStartDateTime } }    // Existing event ends after desired starts
      ]
    };

    const conflictingEvents = await Event.find(query).limit(1); // Find if any conflict exists
    return conflictingEvents.length === 0; // True if no conflicts, false otherwise
  } catch (error) {
    console.error('Error checking broker availability:', error);
    throw error; // Re-throw for upstream error handling
  }
}

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

// Create a new event (for chatbot booking)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
});

router.post('/check-availability', async (req, res) => {
  // Expecting 'date' (e.g., 'YYYY-MM-DD') and 'desiredStartTime' (e.g., 'HH:MM') in request body
  const { date, desiredStartTime } = req.body;

  try {
    const isAvailable = await checkBrokerAvailability(date, desiredStartTime);

    if (isAvailable) {
      res.json({ status: 'available', message: 'The requested 1-hour slot is available.' });
    } else {
      res.json({ status: 'unavailable', message: 'The requested 1-hour slot overlaps with an existing event.' });
    }
  } catch (error) {
    // Centralized error handling for this route
    console.error('API Error in /api/events/check-availability:', error);
    // Send a 400 for client-side input errors, 500 for server issues
    res.status(400).json({ status: 'error', message: error.message || 'Invalid request data or server error.' });
  }
});

router.post('/schedule', async (req, res) => {
  // Expected request body format:
  // {
  //   "date": "YYYY-MM-DD",          // e.g., "2025-07-01"
  //   "desiredStartTime": "HH:MM",   // e.g., "10:00"
  //   "eventDetails": {              // Full details of the event to be created
  //     "title": "Property Showing",
  //     "extendedProps": {
  //       "type": "booking",
  //       "client": "Jane Doe",
  //       "clientPhone": "123-456-7890",
  //       "propertyName": "Luxury Villa",
  //       // ... other extendedProps fields
  //     }
  //     // ... other top-level event fields like 'allDay' if needed
  //   }
  // }
  const { date, desiredStartTime, eventDetails } = req.body;

  try {
    // --- Step 1: Check Availability ---
    const isAvailable = await checkBrokerAvailability(date, desiredStartTime);

    if (!isAvailable) {
      return res.status(409).json({ // 409 Conflict status
        status: 'unavailable',
        message: 'The requested time slot is not available. It conflicts with an existing event.'
      });
    }

    // --- Step 2: If Available, Create the Event ---
    // Calculate precise start and end Date objects for the new event
    const newEventStart = new Date(date);
    const [hours, minutes] = desiredStartTime.split(':').map(Number);
    newEventStart.setHours(hours, minutes, 0, 0);

    const newEventEnd = new Date(newEventStart);
    newEventEnd.setHours(newEventEnd.getHours() + 1); // 1 hour duration

    // Construct the new event object
    const newEventData = {
      ...eventDetails, // Spread all provided event details
      title: eventDetails.title || 'New Scheduled Event', // Ensure title exists
      start: newEventStart,
      end: newEventEnd,
      allDay: eventDetails.allDay || false, // Default to false if not provided
      extendedProps: {
        type: 'booking', // Default to 'booking' for new appointments, override if eventDetails.extendedProps.type is provided
        ...eventDetails.extendedProps // Spread extendedProps
      }
    };

    const newEvent = new Event(newEventData);
    await newEvent.save();

    res.status(201).json({
      status: 'success',
      message: 'Event successfully scheduled and booked!',
      event: newEvent
    });

  } catch (error) {
    console.error('API Error in /api/events/schedule:', error);
    // Provide specific error messages for client-side issues
    if (error.message.includes('Invalid') || error.name === 'ValidationError') {
      return res.status(400).json({ status: 'error', message: error.message || 'Invalid request data provided.' });
    }
    res.status(500).json({ status: 'error', message: 'An internal server error occurred during scheduling.' });
  }
});

module.exports = router;