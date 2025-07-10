from backend.ai_service.services.search import generate_mongo_query, query_db
from backend.ai_service.services.distance_calc import handle_query


async def handle_map_query(llm, user_query, conversation_history):
    prop_desc = await call_property_ref_llm(llm, user_query, conversation_history)
    print(f"Property description from LLM: {prop_desc}")
    if prop_desc == "unknown":
        return "Can you tell me which apartment you're asking about? (e.g., 2-bed in SoHo)"

    db_query = generate_mongo_query(user_query, prop_desc, llm)
    db_result = query_db(db_query)

    lat, lon = await extract_coords_by_llm(db_result)
    print(f"Extracted coordinates: {lat}, {lon}")
    
    response = await handle_query(lat, lon, user_query, llm)

    return response

async def call_property_ref_llm(llm, user_query, conversation_history):
    prompt = f"""
        You're helping a leasing assistant understand a real estate query. Here's the full conversation history:

        {conversation_history}

        Now the user asked:
        "{user_query}"

        Which specific property is the user referring to?
        Respond with a short summary like: "2 bed / 1 bath in SoHo"
        And in the response mention that the latitude and longitute of this property needed to be extracted from the database.
        If unclear, say: "unknown"
        """
    # use GPT-3.5 or existing LLM call
    response = await llm.ainvoke(prompt)
    return response

async def extract_coords_by_llm(db_result):
    if not db_result:
        return None, None

    # Assuming db_result is a list of dictionaries with 'latitude' and 'longitude' keys
    first_listing = db_result[0]
    lat = first_listing.get('latitude')
    lon = first_listing.get('longitude')

    if lat is None or lon is None:
        return None, None

    return lat, lon