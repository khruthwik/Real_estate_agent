// models/LeaseRequest.js
const mongoose = require('mongoose');

const leaseRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  email: {
    type: String,
    
  },
  phone: {
    type: String,
    
  },
  summary: {
    type: String,
    
  },
  interest: {
    type: Number,
    min: 1,
    max: 10,
  },
  action: {
    type: String,
    
  },
  propertyType: {
    type: String,
    
  },
  budget: {
    type: String,
    
  },
  location: {
    type: String,
    
  }
}, { timestamps: true });

module.exports = mongoose.model('LeaseRequest', leaseRequestSchema);
