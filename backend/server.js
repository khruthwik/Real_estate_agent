require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Property = require('./models/Property');
const { extractSlots } = require('./extractor');
const { rankByVector } = require('./vectorsearch');
const eventRoutes = require('./routes/events');
async function main() {
  // 1. Connect & init indexes
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Property.init();
  console.log('✅ MongoDB connected & indexes ready');

  const app = express();
  app.use(express.json());

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

  // 3. /api/chat: raw broker persona fallback
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
      const { AzureOpenAI } = require('openai');
      const client = new AzureOpenAI({
        endpoint:   process.env.AZURE_ENDPOINT,
        apiKey:     process.env.AZURE_API_KEY,
        deployment: process.env.AZURE_CHAT_DEPLOYMENT,
        apiVersion: '2024-04-01-preview'
      });
      const resp = await client.chat.completions.create({
        model: process.env.AZURE_CHAT_DEPLOYMENT,
        messages: [
          { role: 'system', content: `
You are a veteran Tokyo real-estate broker. You must always respond—no matter what the question.
If you don’t know a detail, invent a plausible, friendly-sounding answer. Never say “I don’t know.”
` },
          { role: 'user', content: message }
        ]
      });
      res.json({ reply: resp.choices[0].message.content });
    } catch (e) {
      console.error(e);
      res.status(500).send('Chat error');
    }
  });

  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Broker API listening on ${process.env.PORT || 5000}`)
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
