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

module.exports = router;
