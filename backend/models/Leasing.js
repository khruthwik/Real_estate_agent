// models/LeaseRequest.js
const mongoose = require('mongoose');

const leaseRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  interest: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  action: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('LeaseRequest', leaseRequestSchema);
