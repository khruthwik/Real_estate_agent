const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  extendedProps: {
    // Basic shared fields
    type: { type: String, enum: ['booking', 'open_slot', 'training', 'out_of_office'], default: 'booking', required: true },
    description: { type: String },
    notes: { type: String },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    appointmentType: { type: String }, // e.g., 'Property Showing', 'Buyer Consultation', 'Closing'
    meetingLocation: { type: String },
    estimatedDuration: { type: Number }, // Duration in minutes

    // Client/Contact Information
    client: { type: String },
    clientPhone: { type: String },
    clientEmail: { type: String },
    leadSource: { type: String }, // e.g., 'Referral', 'Online listing', 'Google Ads'
    followUpRequired: { type: Boolean, default: false },
    clientPreferences: { type: String },

    // Property-specific Information (for 'booking' events related to properties)
    propertyName: { type: String },
    propertyAddress: { type: String },
    propertyPrice: { type: String }, // Storing as string to handle "$1,250,000" or ranges
    propertyType: { type: String }, // e.g., 'Luxury Condo', 'Single Family Home', 'Loft Condo'
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    sqft: { type: Number },
    listingAgent: { type: String }, // The agent responsible for the listing
    commission: { type: String }, // Storing as string (e.g., '3%')

    // Specific Status/Context Fields
    preApprovalStatus: { type: String }, // For buyer consultations
    urgency: { type: String }, // For buyer consultations
    listingPotential: { type: String }, // For listing presentations
    competitorAnalysis: { type: String }, // For listing presentations
    closingDate: { type: Date }, // For closing meetings
  },
});

module.exports = mongoose.model('Event', eventSchema);