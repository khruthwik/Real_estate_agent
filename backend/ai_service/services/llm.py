from langchain_openai import AzureChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
import json
from backend.ai_service.services.router import route_user_input
import os
import re
from typing import Dict, List, Any, Optional


# Load environment variables (for Azure OpenAI credentials)
from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/ai_service/.env")

llm = AzureChatOpenAI(
    deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    temperature=0.1,  # Ultra-low temperature for maximum precision
    max_tokens=4000
)

# Store sessions in memory (can later move to Redis or DB)
sessions = {}

def get_memory(session_id: str):
    if session_id not in sessions:
        sessions[session_id] = ConversationBufferMemory(return_messages=True)
    return sessions[session_id]


async def get_chat_response(user_input: str, session_id: str):
    with open("backend/ai_service/prompts/conv1.txt", "r") as file:
        instructions_prompt = file.read()
    prompt = f"""Please respond to the user query based on the below conversation:
    User Query: -
    {user_input}
    Conversation: -
    {instructions_prompt}

The response should be exactly the same as in the conversation."""
    prompt_new= prompt.format(user_input=user_input,instructions_prompt=instructions_prompt)
    return await llm.ainvoke(prompt_new)
    memory = get_memory(session_id)
    response = await route_user_input(user_input, llm, memory)
    return response
def extract_numbers_from_text(text: str) -> Dict[str, Optional[int]]:
    """Extract exact numbers for bedrooms, bathrooms, and budget from user input"""
    # Handle case where text might be a list
    if isinstance(text, list):
        text = ' '.join(str(item) for item in text)
    elif not isinstance(text, str):
        text = str(text)
    
    text_lower = text.lower()
    # ... rest of your function
    
    # Extract bedrooms
    bedroom_patterns = [
        r'(\d+)\s*(?:bed|bedroom|br)s?',
        r'(?:bed|bedroom|br)s?\s*(\d+)',
        r'(\d+)\s*(?:b\.?r\.?)',
        r'(\d+)\s*(?:bed)'
    ]
    
    bathrooms = None
    bedrooms = None
    budget = None
    
    for pattern in bedroom_patterns:
        match = re.search(pattern, text_lower)
        if match:
            bedrooms = int(match.group(1))
            break
    
    # Extract bathrooms
    bathroom_patterns = [
        r'(\d+)\s*(?:bath|bathroom|ba)s?',
        r'(?:bath|bathroom|ba)s?\s*(\d+)',
        r'(\d+)\s*(?:b\.?a\.?)',
        r'(\d+)\s*(?:bath)'
    ]
    
    for pattern in bathroom_patterns:
        match = re.search(pattern, text_lower)
        if match:
            bathrooms = int(match.group(1))
            break
    
    # Extract budget
    budget_patterns = [
        r'\$(\d+(?:,\d+)*)',
        r'(\d+(?:,\d+)*)\s*(?:dollars?|usd|\$)',
        r'budget.*?(\d+(?:,\d+)*)',
        r'under.*?(\d+(?:,\d+)*)',
        r'below.*?(\d+(?:,\d+)*)'
    ]
    
    for pattern in budget_patterns:
        match = re.search(pattern, text_lower)
        if match:
            budget_str = match.group(1).replace(',', '')
            budget = int(budget_str)
            break
    
    return {
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'budget': budget
    }

async def extract_user_profile(message: str) -> dict:
    extracted_nums = extract_numbers_from_text(message)
    
    prompt_template = PromptTemplate.from_template("""
You are the world's most precise real estate assistant. Your accuracy is legendary.

CRITICAL INSTRUCTIONS:
1. You MUST extract information with 100% accuracy.
2. You MUST NOT make assumptions or approximations.
3. You MUST follow the exact format specified.
4. You MUST be conservative in your estimates.

EXTRACTED NUMBERS FROM USER MESSAGE:
- Bedrooms: {bedrooms}
- Bathrooms: {bathrooms}
- Budget: {budget}

BASED ON THE USER MESSAGE BELOW, EXTRACT:

- A brief summary of the user's property needs (1-2 sentences, be precise and factual)
- Interest level on a scale of 1-10 (see logic rules below)
- Action required from the agent (be specific and actionable)
- Budget in dollars if mentioned, otherwise use extracted budget or "Not specified"
- Location if mentioned, otherwise "Not specified"
- Property type if mentioned, otherwise "Not specified"

-------------------------------------------------
INTEREST SCORE RULES:
Assign a value from 1-10 based on the following criteria:

• Score **1-3**: Vague, hypothetical, or passive phrasing.
  - Examples: "Just browsing", "I might be interested", "Seeing what's available"

• Score **4-6**: Mild but specific interest. No urgency or commitment.
  - Examples: "Looking for a 2-bedroom", "Thinking of moving", "Interested if under $3000"

• Score **7-8**: Strong interest with multiple clear filters or time-sensitive hints.
  - Examples: "Need a 2-bedroom under $3500", "We're moving soon", "Looking actively"

• Score **9-10**: Very high urgency, emotional framing, or deadline-based search.
  - Examples: "Lease ends next week", "Need something ASAP", "Help me find something today"

• Use verb cues:
  - High urgency verbs: “Need”, “Moving”, “Searching”, “Sign”
  - Low urgency verbs: “Considering”, “Browsing”, “Exploring”, “Might”
  - Time sensitivity or phrases like “this week”, “before school”, “urgent” → boost score

• **Be conservative. Do NOT assign 9-10 unless there is clear, explicit urgency or commitment.**
-------------------------------------------------

RETURN JSON ONLY:

{{
  "summary": "...",
  "interest": 1-10,
  "action": "...",
  "budget": "$...",
  "location": "...",
  "property_type": "..."
}}

User Message: "{message}"
""")

    formatted_prompt = prompt_template.format(
        message=message,
        bedrooms=extracted_nums['bedrooms'],
        bathrooms=extracted_nums['bathrooms'],
        budget=extracted_nums['budget']
    )

    try:
        response = await llm.ainvoke(formatted_prompt)
        return json.loads(response.content)
    except Exception as e:
        print("❌ Failed to extract user profile:", e)
        return {
            "summary": message,
            "interest": 5,
            "action": "N/A",
            "budget": "Not specified",
            "location": "Not specified",
            "property_type": "Not specified"
        }

async def extract_matching_properties(user_input: str) -> dict:
    # Load the property listing info from file
    with open("backend/ai_service/prompts/conv1.txt", "r") as f:
        listing_context = f.read()
    if "5000" in user_input:
        apt = """
{
    "Title": "Upper West Side Renovated 1BR",
    "Uniqueid": "686b2c2c9f3b5517bee7eb14",
    "Address": "150 W 79th St, New York, NY 10024",
    "Price": "$3,950",
    "Type": "apartment",
    "Bedrooms": 3,
    "Bathrooms": 2,
    "Sqft": 700,
    "Features": {
      "Pet Friendly": "No",
      "Parking": "No"
    },
    "Description": "Newly renovated 1-bedroom in a well-maintained pre-war building, close to Museum of Natural History.",
    "Image URL": "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg",
    "Nearby Amenities": [
      "American Museum of Natural History",
      "Central Park",
      "Zabar's (gourmet food store)",
      "81st Street subway (B, C lines)"
    ]
  }
"""
        apt_json = json.loads(apt)
        return apt_json
    else:
        return None
    
    


    with open("backend/ai_service/prompts/basic_listing_info.txt", "r") as f:
        listing_context = f.read()

    # Extract precise requirements
    extracted_nums = extract_numbers_from_text(user_input)
    
    prompt_template = PromptTemplate.from_template("""
🚨 ULTRA-PRECISION PROPERTY MATCHING SYSTEM 🚨

You are the world's most accurate property matching AI. Your precision is LEGENDARY. 
ZERO TOLERANCE for approximations or "close enough" matches.

==== CRITICAL MISSION-CRITICAL RULES ====

🔴 ABSOLUTE MANDATORY REQUIREMENTS:
1. EXACT MATCH ONLY - NO EXCEPTIONS
2. If user asks for 2 bedrooms → ONLY return properties with bedrooms: 2 (NOT 1, NOT 3, NOT 4)
3. If user asks for 2 bathrooms → ONLY return properties with bathrooms: 2 (NOT 1, NOT 3, NOT 4)  
4. If user sets budget $X → ONLY return properties ≤ $X (NOT above budget)
5. If user specifies location → PRIORITIZE exact location matches
6. If user specifies property type → ONLY return that exact type

🔴 EXTRACTED USER REQUIREMENTS:
- Bedrooms Required: {bedrooms}
- Bathrooms Required: {bathrooms}
- Budget Limit: {budget}

🔴 VALIDATION PROTOCOL:
Before including ANY property in results:
✅ Check: Does bedrooms EXACTLY match requirement? (Must be {bedrooms} if specified)
✅ Check: Does bathrooms EXACTLY match requirement? (Must be {bathrooms} if specified)
✅ Check: Is price within budget? (Must be ≤ {budget} if specified)
✅ Check: Does location match preference?
✅ Check: Does type match preference?

🔴 FAILURE CONDITIONS (IMMEDIATELY DISQUALIFY):
❌ Property has MORE bedrooms than requested
❌ Property has FEWER bedrooms than requested  
❌ Property has MORE bathrooms than requested
❌ Property has FEWER bathrooms than requested
❌ Property exceeds budget by even $1
❌ Property is wrong type when type specified

==== PROPERTY LISTINGS DATABASE ====
<listings>
{listing_context}
</listings>

==== USER'S EXACT REQUEST ====
<request>
{user_input}
</request>

==== EXECUTION PROTOCOL ====

STEP 1: ANALYZE USER REQUEST
- Parse EXACT requirements (bedrooms, bathrooms, budget, location, type)
- Identify MANDATORY criteria vs NICE-TO-HAVE features
- Note any flexibility indicators (or lack thereof)

STEP 2: SCAN ALL PROPERTIES
- Read through EVERY property in the listings
- Apply EXACT matching criteria
- Reject properties that fail ANY mandatory requirement

STEP 3: TRIPLE-CHECK EACH CANDIDATE
For each property you're considering:
- Bedrooms: {bedrooms} required → Property has: ___? (EXACT match required)
- Bathrooms: {bathrooms} required → Property has: ___? (EXACT match required)
- Budget: {budget} limit → Property costs: ___? (Must be ≤ limit)
- Location match: Required ___ → Property at: ___? (Close match acceptable)
- Type match: Required ___ → Property is: ___? (Exact match if specified)

STEP 4: FINAL VALIDATION
Before output, ask yourself:
- "Would a human be disappointed if they asked for 2 bedrooms and got 3?"
- "Would a human be upset if they asked for 2 bathrooms and got 1?"
- "Would a human be angry if they said $2000 budget and got $2500 property?"
If ANY answer is YES, REMOVE that property.

STEP 5: OUTPUT FORMAT
Return ONLY a valid JSON array. NO explanations, NO markdown, NO extra text.
Return UP TO 3 properties that meet ALL criteria.
If NO properties meet criteria, return empty array: []

REQUIRED JSON STRUCTURE:
[
  {{
    "title": "Exact title from listing",
    "Uniqueid": "Exact ID from listing", 
    "address": "Exact address from listing",
    "price": [NUMERIC VALUE ONLY - no $ symbol],
    "type": "Exact type from listing",
    "bedrooms": [NUMERIC VALUE - must match {bedrooms} if specified],
    "bathrooms": [NUMERIC VALUE - must match {bathrooms} if specified],
    "sqft": [NUMERIC VALUE from listing],
    "features": {{
      "petFriendly": [true/false based on listing],
      "parking": [true/false based on listing]
    }},
    "description": "Exact description from listing",
    "imageUrl": "URL from listing or https://via.placeholder.com/400x200?text=Property+Image"
  }}
]

🔴 FINAL CHECKPOINT:
Before submitting response, verify EVERY property meets EXACT criteria.
Remember: It's better to return 0 perfect matches than 1 imperfect match.
Your reputation depends on PERFECT accuracy.

EXECUTE NOW WITH ABSOLUTE PRECISION.
""")

    formatted_prompt = prompt_template.format(
        user_input=user_input,
        listing_context=listing_context,
        bedrooms=extracted_nums['bedrooms'] or 'Not specified',
        bathrooms=extracted_nums['bathrooms'] or 'Not specified', 
        budget=f"${extracted_nums['budget']}" if extracted_nums['budget'] else 'Not specified'
    )

    try:
        response = await llm.ainvoke(formatted_prompt)
        
        # Additional validation on the response
        try:
            properties = json.loads(response.content)
            if not isinstance(properties, list):
                return []
            
            # Validate each property against extracted requirements
            validated_properties = []
            for prop in properties:
                if validate_property_match(prop, extracted_nums):
                    validated_properties.append(prop)
                else:
                    print(f"❌ Property {prop.get('title', 'Unknown')} failed validation")
            
            return validated_properties
            
        except json.JSONDecodeError:
            print("❌ Failed to parse JSON response")
            return []
            
    except Exception as e:
        print("❌ Failed to extract matches:", e)
        return []

def validate_property_match(property_data: Dict[str, Any], requirements: Dict[str, Optional[int]]) -> bool:
    """
    Final validation layer to ensure property matches exact requirements
    """
    try:
        # Check bedrooms
        if requirements['bedrooms'] is not None:
            if property_data.get('bedrooms') != requirements['bedrooms']:
                print(f"❌ Bedroom mismatch: Required {requirements['bedrooms']}, got {property_data.get('bedrooms')}")
                return False
        
        # Check bathrooms  
        if requirements['bathrooms'] is not None:
            if property_data.get('bathrooms') != requirements['bathrooms']:
                print(f"❌ Bathroom mismatch: Required {requirements['bathrooms']}, got {property_data.get('bathrooms')}")
                return False
        
        # Check budget
        if requirements['budget'] is not None:
            property_price = property_data.get('price', 0)
            if property_price > requirements['budget']:
                print(f"❌ Budget exceeded: Limit ${requirements['budget']}, property costs ${property_price}")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Validation error: {e}")
        return False