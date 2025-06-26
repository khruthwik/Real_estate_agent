require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { extractSlots } = require('./extractor');
const { embed, rankByVector } = require('./vectorsearch');

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2) Define Property model
const PropertySchema = new mongoose.Schema({
  title:       { type: String,  required: true },
  address:     { type: String,  required: true },
  price:       { type: Number,  required: true },
  type:        { type: String,  required: true },   
  bedrooms:    { type: Number,  required: true },
  bathrooms:   { type: Number,  required: true },
  features:    {                         
    petFriendly: Boolean,
    parking:     Boolean
  },
  description: { type: String,  required: true },  
  info_vector: { type: [Number], index: '2dsphere' }, 
  createdAt:   { type: Date,    default: Date.now }
});
const Property = mongoose.model('Property', PropertySchema);

// 3) Routes
// GET all properties
app.get('/api/properties', async (req, res) => {
  try {
    const props = await Property.find({}).sort({ createdAt: -1 }).lean();
    res.json(props);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// POST a new property (compute embedding for description)
app.post('/api/properties', async (req, res) => {
  try {
    const data = req.body;
    // compute vector embedding for description
    const vector = await embed(data.description);
    const newProp = await Property.create({ ...data, info_vector: vector });
    res.status(201).json(newProp);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// POST a search query: slot extraction, structured filter, then vector re-rank
app.post('/api/search', async (req, res) => {
  const { query: q } = req.body;
  try {
    // 1) parse structured slots + info text
    const { bedrooms, bathrooms, location, info } = await extractSlots(q);

    // 2) build Mongo filter
    const filter = {
      ...(bedrooms  != null && { bedrooms  }),
      ...(bathrooms != null && { bathrooms }),
      ...(location  && { address: new RegExp(location, 'i') })
    };
    const matched = await Property.find(filter).exec();
    if (!matched.length) return res.json([]);

    // 3) vector re-rank on description embeddings
    const top = await rankByVector(matched, info);
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// 4) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
