import { Schema, model } from 'mongoose';

const PropertySchema = new Schema({
  bedrooms:  { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  price:     { type: Number, required: true },
  location:  { type: String, required: true },
  info_text: { type: String, required: true },
  info_vector: { type: [Number], index: '2dsphere' } // array of floats
});

export const Property = model('Property', PropertySchema);