const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
 
// Import your models (e.g., property.js if needed for DB use elsewhere)
require('./models/property');

// Simple health check
app.get('/', (req, res) => {
  res.send('JS Backend is running');
});

// 🧠 Proxy to AI microservice (Python FastAPI)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, session_id } = req.body;

    const aiResponse = await axios.post('http://localhost:8000/chat', {
      message,
      session_id: session_id || 'default',
    });

    res.json(aiResponse.data);
  } catch (err) {
    console.error('AI service error:', err.message);
    res.status(500).json({ error: 'AI service failed.' });
  }
});

// 🔌 Optional: keep other non-AI routes here if needed

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
