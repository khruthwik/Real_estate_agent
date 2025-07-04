
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
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
  info_vector: [Number], // for embeddings-based search (e.g., OpenAI, FAISS)

  // Image & metadata
  imageUrl: { type: String },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);

