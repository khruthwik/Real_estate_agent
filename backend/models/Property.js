import { Schema, model } from 'mongoose';

const PropertySchema = new Schema({
  bedrooms:  { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  price:     { type: Number, required: true },
  location:  { type: String, required: true },
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

export const Property = model('Property', PropertySchema);