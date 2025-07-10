require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const Property = require('./models/Property');
const leaseRoutes = require('./routes/leases');
const eventRoutes = require('./routes/events');
const SavedProperty = require('../backend/models/savedproperty');
const axios = require('axios');
const authRoutes = require('./routes/auth');
const fs = require('fs');
const path = require('path');


async function main() {
 
  // Replace your current connection code with this:
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3"
, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 
    console.log('Connected to MongoDB');
    
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// Remove the app.listen at the bottom of your file
  

  const app = express();
  app.use(express.json());
  app.use(cors({
  origin: '*'
}));

  // getting all the properties
  app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    
    const transformedProperties = properties.map(property => ({
      id: property._id,
      title: property.title,
      address: property.location, 
      price: property.price,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      features: {
        petFriendly: property.features.petFriendly,
        parking: property.features.parking
      },
      description: property.info_text, 
      imageUrl: property.imageUrl,
      info_vector: property.info_vector,
      createdAt: property.createdAt
    }));
    
    res.json(transformedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Transform MongoDB response to match frontend format
    const transformedProperty = {
      id: property._id,
      title: property.title,
      address: property.location,
      price: property.price,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      features: {
        petFriendly: property.features.petFriendly,
        parking: property.features.parking
      },
      description: property.info_text,
      imageUrl: property.imageUrl,
      info_vector: property.info_vector,
      createdAt: property.createdAt
    };
    
    res.json(transformedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});


app.post('/api/properties', async (req, res) => {
  try {
    const {
      title,
      address,
      price,
      type,
      bedrooms,
      bathrooms,
      sqft,
      features,
      description,
      imageUrl,
      info_vector
    } = req.body;

    // Validation
  
    // Create new property with schema mapping
    const newProperty = new Property({
      title,
      location: address, // Map address to location for schema
      price,
      type,
      bedrooms,
      bathrooms,
      sqft,
      info_text: description, // Map description to info_text for schema
      features: {
        petFriendly: features?.petFriendly || false,
        parking: features?.parking || false
      },
      imageUrl,
      info_vector: info_vector || []
    });

    const savedProperty = await newProperty.save();
    const filePath = path.join(__dirname, '..','backend', 'ai_service', 'prompts', 'basic_listing_info.txt');
    fs.readFile(filePath, 'utf8', (readErr, data) => {
  let serial = 1;

  if (!readErr && data.trim()) {
    // Count how many lines start with a serial number (e.g., "1.", "2.", ...)
    const matches = data.match(/^\d+\./gm);
    serial = matches ? matches.length + 1 : 1;
  }

  // Step 2: Create formatted string
  const summaryLine = `${serial}. Title: ${title || 'N/A'},\n` +
    `   Unique ID: ${savedProperty._id},\n` +
    `   Address: ${address || 'N/A'},\n` +
    `   Price: $${price ? price.toLocaleString() : 'N/A'},\n` +
    `   Type: ${type || 'N/A'},\n` +
    `   Bedrooms: ${bedrooms || 'N/A'},\n` +
    `   Bathrooms: ${bathrooms || 'N/A'},\n` +
    `   Sqft: ${sqft ? sqft.toLocaleString() : 'N/A'},\n` +
    `   Features:\n` +
    `     - Pet Friendly: ${features?.petFriendly ? 'Yes' : 'No'}\n` +
    `     - Parking: ${features?.parking ? 'Yes' : 'No'}\n` +
    `   Description: ${description || 'N/A'}\n` +
    `   Image URL: ${imageUrl || 'N/A'}\n\n`; // 👈 extra newline for spacing

  // Step 3: Append to file
  fs.appendFile(filePath, summaryLine, (err) => {
    if (err) {
      console.error("❌ Failed to update basic_listing_info.txt:", err);
    } else {
      console.log("✅ basic_listing_info.txt updated with serial:", serial);
    }
  });
});

    // Transform response back to frontend format
    const responseProperty = {
      id: savedProperty._id,
      title: savedProperty.title,
      address: savedProperty.location,
      price: savedProperty.price,
      type: savedProperty.type,
      bedrooms: savedProperty.bedrooms,
      bathrooms: savedProperty.bathrooms,
      sqft: savedProperty.sqft,
      features: {
        petFriendly: savedProperty.features.petFriendly,
        parking: savedProperty.features.parking
      },
      description: savedProperty.info_text,
      imageUrl: savedProperty.imageUrl,
      info_vector: savedProperty.info_vector,
      createdAt: savedProperty.createdAt
    };

    res.status(201).json(responseProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create property' });
  }
});


app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      address,
      price,
      type,
      bedrooms,
      bathrooms,
      sqft,
      features,
      description,
      imageUrl,
      info_vector
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Validation
    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (bedrooms !== undefined && (typeof bedrooms !== 'number' || bedrooms < 0)) {
      return res.status(400).json({ error: 'Bedrooms must be a non-negative number' });
    }

    if (bathrooms !== undefined && (typeof bathrooms !== 'number' || bathrooms < 0)) {
      return res.status(400).json({ error: 'Bathrooms must be a non-negative number' });
    }

    if (sqft !== undefined && (typeof sqft !== 'number' || sqft <= 0)) {
      return res.status(400).json({ error: 'Square footage must be a positive number' });
    }

    // Prepare update object with schema mapping
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (address !== undefined) updateData.location = address;
    if (price !== undefined) updateData.price = price;
    if (type !== undefined) updateData.type = type;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms;
    if (sqft !== undefined) updateData.sqft = sqft;
    if (description !== undefined) updateData.info_text = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (info_vector !== undefined) updateData.info_vector = info_vector;
    if (features !== undefined) updateData.features = features;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Transform response back to frontend format
    const responseProperty = {
      id: updatedProperty._id,
      title: updatedProperty.title,
      address: updatedProperty.location,
      price: updatedProperty.price,
      type: updatedProperty.type,
      bedrooms: updatedProperty.bedrooms,
      bathrooms: updatedProperty.bathrooms,
      sqft: updatedProperty.sqft,
      features: {
        petFriendly: updatedProperty.features.petFriendly,
        parking: updatedProperty.features.parking
      },
      description: updatedProperty.info_text,
      imageUrl: updatedProperty.imageUrl,
      info_vector: updatedProperty.info_vector,
      createdAt: updatedProperty.createdAt,
      updatedAt: updatedProperty.updatedAt
    };

    res.json(responseProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update property' });
  }
}); 


app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    
    const deletedProperty = await Property.findByIdAndDelete(id);
    
    if (!deletedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully', id });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

app.post('/api/properties/save', async (req, res) => {
  try {
    const { userId, property } = req.body;

    if (!userId || !property) {
      return res.status(400).json({ error: 'User ID and property data are required' });
    }

    const savedProperty = new SavedProperty({
      userId,
      property
    });

    await savedProperty.save();

    res.status(201).json({ 
      success: true,
      message: 'Property saved successfully',
      savedProperty 
    });

  } catch (error) {
    console.error('Error saving property:', error);
    res.status(500).json({ error: 'Failed to save property' });
  }
});


// Get saved properties endpoint
app.get('/api/properties/saved/:email', async (req, res) => {
  try {
    console.log('Fetching saved properties for email:', req.params.email); // ✅ DEBUG
    const userId = req.params.email;

    const savedProperties = await SavedProperty.find({ userId }).sort({ savedAt: -1 });
    console.log('Found saved properties:', savedProperties.length); // ✅ DEBUGß

    res.json({ 
      success: true, 
      savedProperties 
    });

  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({ error: 'Failed to fetch saved properties' });
  }
});

app.delete('/api/properties/unsave', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) {
      return res.status(400).json({ error: 'User ID and property ID are required' });
    }
    
    await SavedProperty.findOneAndDelete({ 
      userId, 
      'property._id': propertyId 
    });
    
    res.json({ success: true, message: 'Property unsaved successfully' });
  } catch (error) {
    console.error('Error unsaving property:', error);
    res.status(500).json({ error: 'Failed to unsave property' });
  }
});



app.post('/api/properties/search', async (req, res) => {
  try {
    const { query_vector, limit = 10 } = req.body;
    
    if (!query_vector || !Array.isArray(query_vector)) {
      return res.status(400).json({ error: 'query_vector must be an array of numbers' });
    }
    
    // This is a basic implementation. For actual vector similarity search,
    // you might want to use MongoDB Atlas Vector Search or implement
    // cosine similarity calculation
    const properties = await Property.find({
      info_vector: { $exists: true, $ne: [] }
    }).limit(limit);
    
    // Transform response
    const transformedProperties = properties.map(property => ({
      id: property._id,
      title: property.title,
      address: property.location,
      price: property.price,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      features: {
        petFriendly: property.features.petFriendly,
        parking: property.features.parking
      },
      description: property.info_text,
      imageUrl: property.imageUrl,
      info_vector: property.info_vector,
      createdAt: property.createdAt
    }));
    
    res.json(transformedProperties);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Failed to search properties' });
  }
});


  // 2. /api/search: filter → fallback → vector re-rank
  app.post('/api/search', async (req, res) => {
    const { query: q, bedrooms, bathrooms, location, priceMax, petFriendly, parking } = req.body;
    try {
      // parse free-text if q provided
      let slots = { bedrooms, bathrooms, location, info: q };
      if (q) slots = await extractSlots(q);

      // build filter object
      const filter = {
        ...(slots.bedrooms  != null && { bedrooms:  { $gte: slots.bedrooms  } }),
        ...(slots.bathrooms != null && { bathrooms: { $gte: slots.bathrooms } }),
        ...(slots.location && { address: new RegExp(slots.location, 'i') }),
        ...(priceMax      != null && { price:     { $lte: priceMax       } }),
        ...(petFriendly   != null && { 'features.petFriendly': petFriendly }),
        ...(parking       != null && { 'features.parking':     parking     })
      };

      let matched = await Property.find(filter).exec();

      // fallback to newest 5 if none
      let recs = [];
      if (!matched.length) {
        recs = await Property.find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .exec();
      }

      // vector rerank on either matched or recs
      const baseSet = matched.length ? matched : recs;
      const ranked = await rankByVector(baseSet, slots.info);

      res.json({
        exact: matched,
        recommendations: recs,
        ranked
      });
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/events', eventRoutes);
  app.use('/api/leases', leaseRoutes);
  app.use('/api/auth', authRoutes);

  app.post('/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body); // ✅ DEBUG
    const { message, session_id,user } = req.body;

    const aiResponse = await axios.post('http://localhost:8000/chat', {
      message,
      session_id: session_id || 'default',
      user
    });

    res.json(aiResponse.data);
    console.log('AI response:', aiResponse.data); // ✅ DEBUG
  } catch (err) {
    console.error('AI service error:', err.message);
    res.status(500).json({ error: 'AI service failed.' });
  }
});



  // 3. /api/chat: raw broker persona fallback
//   app.post('/api/chat', async (req, res) => {
//     const { message } = req.body;
//     try {
//       const { AzureOpenAI } = require('openai');
//       const client = new AzureOpenAI({
//         endpoint:   process.env.AZURE_ENDPOINT,
//         apiKey:     process.env.AZURE_API_KEY,
//         deployment: process.env.AZURE_CHAT_DEPLOYMENT,
//         apiVersion: '2024-04-01-preview'
//       });
//       const resp = await client.chat.completions.create({
//         model: process.env.AZURE_CHAT_DEPLOYMENT,
//         messages: [
//           { role: 'system', content: `
// You are a veteran Tokyo real-estate broker. You must always respond—no matter what the question.
// If you don't know a detail, invent a plausible, friendly-sounding answer. Never say “I don't know.”
// ` },
//           { role: 'user', content: message }
//         ]
//       });
//       res.json({ reply: resp.choices[0].message.content });
//     } catch (e) {
//       console.error(e);
//       res.status(500).send('Chat error');
//     }
//   });

  app.listen(5000, () =>
    console.log(`🚀 Broker API listening on 5000`)
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
