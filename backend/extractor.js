import 'dotenv/config';
import { AzureOpenAI } from "openai"; // Keep AzureOpenAI for your specific setup

// Your Azure OpenAI configuration
const endpoint = "https://real-estate-agent.openai.azure.com/";
// Note: modelName here is for conceptual clarity, the 'deployment' name is crucial for Azure
const modelName = "gpt-4o";

// Your API key should ideally be loaded from environment variables using dotenv
// For demonstration, it's hardcoded, but consider process.env.AZURE_OPENAI_API_KEY
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-04-01-preview";
// This 'deployment' name MUST exactly match what you configured in Azure OpenAI Studio for gpt-4o
const deployment = "gpt-4o";

// Options object for the Azure OpenAI client
const options = { endpoint, apiKey, deployment, apiVersion };

// Initialize the Azure OpenAI client
const client = new AzureOpenAI(options);

/**
 * extractSlots
 * Parses a free-form rental query into structured fields (bedrooms, bathrooms, location, info)
 * by first using regex for simple numeric slots and then an LLM for more complex parsing.
 * It robustly handles LLM responses that may be wrapped in markdown JSON blocks.
 *
 * @param {string} query The user's natural language rental query.
 * @returns {Promise<object>} An object containing the extracted slots.
 */
export async function extractSlots(query) {
  // 1) Regex for simple numeric slots (initial pass)
  // This helps pre-extract obvious numbers before sending to LLM,
  // potentially making the LLM's job easier or providing a fallback.
  const bdMatch = query.match(/(\d+)\s*(?:bedroom|br)/i);
  const baMatch = query.match(/(\d+)\s*(?:bathroom|ba)/i);
  const initialBedrooms = bdMatch ? parseInt(bdMatch[1], 10) : null;
  const initialBathrooms = baMatch ? parseInt(baMatch[1], 10) : null;

  // 2) LLM prompt for more comprehensive extraction, especially for location and remaining info
  const prompt = `
You are an AI assistant specialized in parsing real estate queries.
Extract the following information from the user's query into a JSON object.
Ensure the output is ONLY the JSON object, do not include any other text or markdown formatting.

JSON Keys to extract:
- bedrooms: (integer or null) - Number of bedrooms.
- bathrooms: (integer or null) - Number of bathrooms.
- location: (string or null) - Specific location (e.g., city, neighborhood, street).
- info: (string) - Any remaining free-text descriptions or requirements not captured by other fields.

Example 1:
Query: "2 br 1 ba apartment in downtown with morning sun and a pet-friendly policy"
Output: {"bedrooms":2,"bathrooms":1,"location":"downtown","info":"apartment with morning sun and a pet-friendly policy"}

Example 2:
Query: "I'm looking for a spacious house with 3 beds near the park, budget around $500k"
Output: {"bedrooms":3,"bathrooms":null,"location":"near the park","info":"spacious house, budget around $500k"}

Example 3:
Query: "Studio in Manhattan"
Output: {"bedrooms":0,"bathrooms":null,"location":"Manhattan","info":"Studio"}

Now parse the following query: "${query}"
`;

  let llmResponseContent;
  try {
    const resp = await client.chat.completions.create({
      // Use the 'deployment' name from your Azure configuration here
      model: deployment,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1, // A slightly higher temperature can sometimes help with natural language parsing
      // For structured output, setting response_format might be useful,
      // but if not explicitly supported or if you're targeting older models,
      // parsing the string is robust.
      // response_format: { type: "json_object" } // Uncomment if your Azure deployment supports this
    });
    llmResponseContent = resp.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling Azure OpenAI for slot extraction:", error);
    // Fallback or re-throw after logging
    return {
      bedrooms: initialBedrooms,
      bathrooms: initialBathrooms,
      location: null,
      info: query // Return original query as info if LLM fails
    };
  }

  let parsedData = {};
  try {
    // Attempt to extract JSON from a markdown block first
    const jsonMatch = llmResponseContent.match(/```json\n([\s\S]*?)\n```/);

    if (jsonMatch && jsonMatch[1]) {
      // If a markdown JSON block is found, parse its content
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // If no markdown block, attempt to parse the entire response directly
      parsedData = JSON.parse(llmResponseContent);
    }
  } catch (parseError) {
    console.error("Error parsing LLM response as JSON:", parseError);
    console.error("Raw LLM response content:", llmResponseContent);
    // Fallback: If LLM returns unparsable JSON, use regex results and original query
    return {
      bedrooms: initialBedrooms,
      bathrooms: initialBathrooms,
      location: null, // Cannot reliably extract location without LLM
      info: query // The whole query becomes info
    };
  }

  // Merge LLM results with initial regex extractions
  // LLM's output is generally preferred for location and more nuanced info
  // Use initial regex findings as a fallback if LLM returns null for bedrooms/bathrooms
  return {
    bedrooms: parsedData.bedrooms !== undefined ? parsedData.bedrooms : initialBedrooms,
    bathrooms: parsedData.bathrooms !== undefined ? parsedData.bathrooms : initialBathrooms,
    location: parsedData.location || null,
    info: parsedData.info || query // If LLM doesn't give info, use original query
  };
}