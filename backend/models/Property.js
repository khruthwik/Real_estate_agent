const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  type: String,
  bedrooms: Number,
  bathrooms: Number,
  sqft: Number,
  features: {
    petFriendly: Boolean,
    parking: Boolean,
  },
  info_text: String,
  imageUrl: String,
  info_vector: [Number],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Property', propertySchema);
