import 'dotenv/config';
import { AzureOpenAI } from "openai";

// Declare all constants before they are used in the 'options' object
const endpoint = "https://real-estate-agent.openai.azure.com/";
const modelName = "gpt-4o"; // This modelName is used for chat/completion, but your deployment is for embeddings
const apiKey = "lAcfByTYluM8rajLsYgqFdnVvdnoNfqQn1840j7uf4KZZpjBnWmTJQQJ99BFACi0881XJ3w3AAABACOG5Liq";
const apiVersion = "2024-04-01-preview";
const deployment = "text-embedding-3-large"; // This should be your Azure deployment name for embeddings

// Now, define the options object using the declared constants
const options = { endpoint, apiKey, deployment, apiVersion };

// Initialize the client using the options
const client = new AzureOpenAI(options);


/**
 * embed
 * Generates an embedding vector for a given text using Azure OpenAI embeddings deployment.
 * Note: The 'model' property in client.embeddings.create should typically match
 * the deployment name on Azure for consistency, or the specific model ID if distinct.
 */
export async function embed(text) {
  const resp = await client.embeddings.create({
    model: deployment, // Use the deployment variable here for consistency with Azure setup
    input: text
  });
  return resp.data[0].embedding;
}

/**
 * cosineSim
 * Computes cosine similarity between two vectors.
 */
function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  // Avoid division by zero if magnitudes are zero (e.g., for zero vectors)
  const denominator = Math.sqrt(magA) * Math.sqrt(magB);
  if (denominator === 0) {
    return 0; // Or handle as an error if appropriate for your application
  }
  return dot / denominator;
}

/**
 * rankByVector
 * Given an array of Mongoose documents with `info_vector`, computes similarity
 * to the user's query info text and returns the top-10 matches.
 */
export async function rankByVector(docs, info) {
  if (!docs || docs.length === 0) {
    return []; // Return empty array if no documents
  }

  // Ensure docs have the info_vector property
  const validDocs = docs.filter(doc => doc.info_vector && Array.isArray(doc.info_vector));
  if (validDocs.length === 0) {
    console.warn("No valid documents with 'info_vector' found for vector ranking.");
    return [];
  }

  const qvec = await embed(info);

  // Filter out any documents that might not have info_vector for robustness
  return validDocs
    .map(doc => {
      const docObject = doc.toObject ? doc.toObject() : doc; // Handle if it's already a plain object
      return {
        ...docObject,
        score: cosineSim(docObject.info_vector, qvec)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}