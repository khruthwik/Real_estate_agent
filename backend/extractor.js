import 'dotenv/config';
import { AzureOpenAI } from 'openai';

const endpoint = "https://real-estate-agent.openai.azure.com/";
const modelName = "gpt-4o"; // This modelName is used for chat/completion, but your deployment is for embeddings
const apiKey = "lAcfByTYluM8rajLsYgqFdnVvdnoNfqQn1840j7uf4KZZpjBnWmTJQQJ99BFACi0881XJ3w3AAABACOG5Liq";
const apiVersion = "2024-04-01-preview";
const deployment = "gpt-4o"; // This should be your Azure deployment name for embeddings

// Now, define the options object using the declared constants
const options = { endpoint, apiKey, deployment, apiVersion };

// Initialize the client using the options
const client = new AzureOpenAI(options);



require('dotenv').config();


/**
 * extractSlots: parse user’s free-text into { bedrooms, bathrooms, location, info }
 */
async function extractSlots(query) {
  // simple regex pre-extract
  const bd = query.match(/(\d+)\s*(?:bedroom|br)/i);
  const ba = query.match(/(\d+)\s*(?:bathroom|ba)/i);
  const bedrooms  = bd ? +bd[1] : null;
  const bathrooms = ba ? +ba[1] : null;

  // LLM prompt
  const prompt = `
You are a real‐estate broker helper. Parse the query into JSON:
{ "bedrooms": int or null,
  "bathrooms": int or null,
  "location": string or null,
  "info":    string }
Query: "${query}"
`;
  let content;
  try {
    const resp = await client.chat.completions.create({
      model: process.env.AZURE_CHAT_DEPLOYMENT,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    });
    content = resp.choices[0].message.content.trim();
  } catch {
    return { bedrooms, bathrooms, location: null, info: query };
  }

  // extract JSON
  let parsed;
  try {
    const m = content.match(/```json\n([\s\S]*?)```/);
    parsed = m ? JSON.parse(m[1]) : JSON.parse(content);
  } catch {
    return { bedrooms, bathrooms, location: null, info: query };
  }

  return {
    bedrooms:  parsed.bedrooms  ?? bedrooms,
    bathrooms: parsed.bathrooms ?? bathrooms,
    location:  parsed.location || null,
    info:      parsed.info     || query
  };
}

module.exports = { extractSlots };
