from langchain_openai import AzureChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
import json
from backend.ai_service.services.router import route_user_input
import os


# Load environment variables (for Azure OpenAI credentials)
from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/ai_service/.env")

llm = AzureChatOpenAI(
    deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

# Store sessions in memory (can later move to Redis or DB)
sessions = {}

def get_memory(session_id: str):
    if session_id not in sessions:
        sessions[session_id] = ConversationBufferMemory(return_messages=True)
    return sessions[session_id]

async def get_chat_response(user_input: str, session_id: str):
    memory = get_memory(session_id)
    response = await route_user_input(user_input, llm, memory)
    return response

async def extract_user_profile(message: str) -> dict:
    prompt_template = PromptTemplate.from_template("""
You are a helpful real estate assistant. Based on the user message below, extract:

- A summary of what they're looking for
- Interest level (1-10)
- Action required from the agent, e.g., "Send listings", "Schedule a viewing", "Follow up next week"
- Budget in dollars (as string) if mentioned, otherwise "7000"
- Location if mentioned and if not mentioned, Fill with "Anywhere"
- Property type if mentioned, otherwise "Apartment"

Return JSON only:
{{
  "summary": "...",
  "interest": 1-10,
  "action": "...",
  "budget": "$...",
  "location": "..."
  "property_type": "..."
}}
                                                   


User Message: "{message}"
""")

    formatted_prompt = prompt_template.format(message=message)

    try:
        response = await llm.ainvoke(formatted_prompt)
        return json.loads(response.content)
    except Exception as e:
        print("❌ Failed to extract user profile:", e)
        return {
            "summary": message,
            "interest": 5,
            "action": "N/A",
            "budget": "",
            "location": ""
        }

async def extract_matching_properties(user_input: str) -> dict:
    # Load the property listing info from file
    with open("backend/ai_service/prompts/basic_listing_info.txt", "r") as f:
        listing_context = f.read()

    prompt_template = PromptTemplate.from_template("""
You are a helpful AI leasing assistant.

You are a helpful AI leasing assistant tasked with finding suitable property listings based on user requests.

**Available Property Listings Data:**
<listings>
{listing_context}
</listings>

**User's Property Request:**
<request>
{user_input}
</request>

**Your Task:**
1.  **Analyze the User Request:** Carefully read the user's request and identify their key preferences (e.g., location, budget, property type, number of bedrooms/bathrooms, specific features like pet-friendly or parking).
2.  **Match Properties:** From the `<listings>` provided, select **up to 3 properties** that best match the user's criteria. Prioritize exact matches where possible.
3.  **Extract Details Accurately:** For each selected property, extract ALL the following details directly from the provided listing context. If a detail is not explicitly present in the listing, provide "N/A" or an appropriate default (e.g., an empty string for `description` if truly absent, or a generic placeholder URL for `imageUrl` if no specific URL is given).
    * `title` (string)
    * `address` (string)
    * `price` (number, *important: ensure this is a numerical value without currency symbols or commas*)
    * `type` (string, e.g., "Apartment", "Condo", "House")
    * `bedrooms` (number)
    * `bathrooms` (number)
    * `sqft` (number)
    * `features`: A JSON object with `petFriendly` (boolean: `true`/`false`) and `parking` (boolean: `true`/`false`).
    * `description` (string)
    * `imageUrl` (string, a valid URL. If the listing doesn't provide one, use a generic placeholder like "https://via.placeholder.com/400x200?text=Property+Image".)

**Output Format:**
Return only a valid JSON array. This array should contain the objects for the matched properties.
*Do NOT* include any other text, explanations, or markdown fences (e.g., ````json`). Just the raw JSON array.

**Example of Expected JSON Array Structure:**
[
  {{
    "title": "Cozy Studio Apartment",
    "address": "123 Main St, Anytown",
    "price": 1200,
    "type": "Apartment",
    "bedrooms": 0,
    "bathrooms": 1,
    "sqft": 400,
    "features": {{
      "petFriendly": false,
      "parking": true
    }},
    "description": "A cozy studio perfect for a single person. Includes a small kitchenette and street parking.",
    "imageUrl": "[https://example.com/images/studio-main-st.jpg](https://example.com/images/studio-main-st.jpg)"
  }},
  {{
    "title": "Spacious 2-Bedroom Condo",
    "address": "456 Oak Ave, Anytown",
    "price": 2500,
    "type": "Condo",
    "bedrooms": 2,
    "bathrooms": 2,
    "sqft": 1100,
    "features": {{
      "petFriendly": true,
      "parking": true
    }},
    "description": "Modern condo with two large bedrooms, in-unit laundry, and covered parking. Pet-friendly building.",
    "imageUrl": "[https://example.com/images/condo-oak-ave.jpg](https://example.com/images/condo-oak-ave.jpg)"
  }}
]
}}
""")

    formatted_prompt = prompt_template.format(
        user_input=user_input,
        listing_context=listing_context
    )

    try:
        response = await llm.ainvoke(formatted_prompt)
        return json.loads(response.content)
    except Exception as e:
        print("❌ Failed to extract matches:", e)
        return {
            "reply": "Sorry, something went wrong.",
            "matches": []
        }
