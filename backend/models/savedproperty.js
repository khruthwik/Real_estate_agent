const mongoose = require('mongoose');

const savedPropertySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  property: {
    type: Object, // store the full property object at save time
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedProperty', savedPropertySchema);
