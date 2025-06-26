import express from 'express';
import Booking from '../models/Bookingmodel';
const router = express.Router();

// Create a booking
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).json(booking);
});

// Predict cancellation
router.post('/predict', async (req, res) => {
  const { partySize, time } = req.body;
  const willCancel = (partySize > 4 && time === '8:00 PM') || Math.random() < 0.3;
  res.json({ willCancel });
});

export default router;
