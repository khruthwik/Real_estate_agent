
const mongoose = require('mongoose');

const propertySchema1 = new mongoose.Schema({
  // Basic Info
  title: { type: String },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String }, // e.g., "house", "condo", "studio"
  
  // Dimensions
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  sqft: { type: Number }, // merged from sq_ft and sqft
  year_built: { type: Number },

  // Boolean attributes
  studio: { type: Boolean },
  independent_home_type: { type: Boolean },
  pets_allowed: { type: Boolean },
  furnished: { type: Boolean },
  ac_available: { type: Boolean },
  pool_available: { type: Boolean },
  dedicated_parking_type: { type: Boolean },
  in_house_laundry: { type: Boolean },
  elevator: { type: Boolean },
  utilities_included: { type: Boolean },
  outdoor_space: { type: Boolean },
  controlled_access: { type: Boolean },

  // Features as an object for UI flags
  features: {
    petFriendly: { type: Boolean },
    parking: { type: Boolean }
  },

  // AI-related fields
  info_text: { type: String, required: true },
  studio: { type: Boolean, required: false },
  independent_home_type: { type: Boolean, required: false },
  sq_ft: { type: Number, required: false },
  year_built: { type: Number, required: false },
  pets_allowed: { type: Boolean, required: false },
  furnished: { type: Boolean, required: false },
  ac_available: { type: Boolean, required: false },
  pool_available: { type: Boolean, required: false },
  dedicated_parking_type: { type: Boolean, required: false },
  in_house_laundry: { type: Boolean, required: false },
  elevator: { type: Boolean, required: false },
  utilities_included: { type: Boolean, required: false },
  outdoor_space: { type: Boolean, required: false },
  controlled_access: { type: Boolean, required: false }
});

module.exports = mongoose.model('Property1', propertySchema1);

