import { AzureOpenAI } from "openai";

const endpoint = "https://real-estate-agent.openai.azure.com/";
const modelName = "text-embedding-3-large"; // This is typically the model ID, not deployment name for Azure OpenAI client

export async function main() {

  const apiKey = "lAcfByTYluM8rajLsYgqFdnVvdnoNfqQn1840j7uf4KZZpjBnWmTJQQJ99BFACi0881XJ3w3AAABACOG5Liq";
  const apiVersion = "2024-04-01-preview";
  const deployment = "text-embedding-3-large"; // This should match your deployment name in Azure
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.embeddings.create({
    input: ["What is your name", "How are you", "What is the capital of india"],
    model: modelName // Ensure this matches the model ID used for your deployment
  });

  for (const item of response.data) {
    let length = item.embedding.length;
    console.log(
      `data[${item.index}]: length=${length}, ` +
      `[${item.embedding[0]}, ${item.embedding[1]}, ` +
      `..., ${item.embedding[length - 2]}, ${item.embedding[length - 1]}]`
    );
  }
  console.log(response.usage);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});