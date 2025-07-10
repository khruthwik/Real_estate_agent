const express = require('express');
const router = express.Router();
const LeaseRequest = require('../models/Leasing');

// GET all leasing requests
router.get('/', async (req, res) => {
  try {
    const leases = await LeaseRequest.find();
    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/save-request', async (req, res) => {
  try {
    const lease = new LeaseRequest(req.body);
    await lease.save();
    res.status(200).json({ message: "Lease request saved." });
  } catch (err) {
    console.error('Error saving lease request:', err);
    res.status(500).json({ error: "Could not save lease request." });
  }
});

module.exports = router;
