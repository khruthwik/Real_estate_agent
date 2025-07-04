const mongoose = require('mongoose');

const PropertySchema1 = new mongoose.Schema({
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  info_text: { type: String, required: true },
  studio: { type: Boolean },
  independent_home_type: { type: Boolean },
  sq_ft: { type: Number },
  year_built: { type: Number },
  pets_allowed: { type: Boolean },
  furnished: { type: Boolean },
  ac_available: { type: Boolean },
  pool_available: { type: Boolean },
  dedicated_parking_type: { type: Boolean },
  in_house_laundry: { type: Boolean },
  elevator: { type: Boolean },
  utilities_included: { type: Boolean },
  outdoor_space: { type: Boolean },
  controlled_access: { type: Boolean }
});

module.exports = mongoose.model('Property1', PropertySchema1);
