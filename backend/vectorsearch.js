import 'dotenv/config';
import { AzureOpenAI } from "openai";

// Declare all constants before they are used in the 'options' object
const endpoint = process.env.AZURE_ENDPOINT; // Ensure this is set in your .env file
const apiKey = process.env.MONGODB_URI;
const apiVersion = process.env.AZURE_API_VERSION; // Default to latest if not set
const deployment = process.env.AZURE_EMBEDDING_DEPLOYMENT; // This should be your Azure deployment name for embeddings

// Now, define the options object using the declared constants
const options = { endpoint, apiKey, deployment, apiVersion };

// Initialize the client using the options
const client = new AzureOpenAI(options);

// embed single string (Azure requires array)
async function embed(text) {
  const resp = await client.embeddings.create({
    model: process.env.AZURE_EMBEDDING_DEPLOYMENT,
    input: [ text ]
  });
  return resp.data[0].embedding;
}

function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

async function rankByVector(docs, info) {
  const valid = docs.filter(d => Array.isArray(d.info_vector));
  if (!valid.length) return [];
  const qstr = typeof info === 'string' ? info : JSON.stringify(info);
  const qvec = await embed(qstr);
  return valid
    .map(doc => ({
      ...doc.toObject(),
      score: cosineSim(doc.info_vector, qvec)
    }))
    .sort((a,b) => b.score - a.score)
    .slice(0, 10);
}

module.exports = { rankByVector };
