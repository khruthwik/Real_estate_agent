const axios = require('axios');
const listings = require('./seedData-full.json'); // <- contains your 30 real listings

const API_URL = 'http://localhost:5000/api/properties'; // adjust if needed

async function seedProperties() {
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    try {
      const res = await axios.post(API_URL, listing);
      console.log(`✅ Added: ${res.data.title}`);
    } catch (err) {
      console.error(`❌ Failed to add ${listing.title}:`, err.response?.data || err.message);
    }
  }
  console.log('🏁 Done seeding via API');
}

seedProperties();
