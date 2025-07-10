import os
import aiohttp
import asyncio

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Utility: Perform GET request
async def fetch_json(url, params):
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as resp:
            return await resp.json()

# --------------------------
# 🧭 Nearby Search (e.g., schools, stores)
# --------------------------
async def get_nearby_place(lat, lon, place_type, radius=3000):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lon}",
        "radius": radius,
        "type": place_type,
        "key": GOOGLE_MAPS_API_KEY
    }
    result = await fetch_json(url, params)
    if result["results"]:
        return result["results"][0]  # Closest place
    return None

# --------------------------
# 🚇 Directions (transit/walking/driving)
# --------------------------
async def get_directions(origin, destination, mode="transit"):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": GOOGLE_MAPS_API_KEY
    }
    result = await fetch_json(url, params)
    if result["routes"]:
        return result["routes"][0]["legs"][0]  # First route leg
    return None

# --------------------------
# 📍 Geocoding
# --------------------------
async def geocode_address(address):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": GOOGLE_MAPS_API_KEY
    }
    result = await fetch_json(url, params)
    if result["results"]:
        loc = result["results"][0]["geometry"]["location"]
        return f"{loc['lat']},{loc['lng']}"
    return None

# --------------------------
# 🧠 Intent Classification
# --------------------------
async def classify_intent(query, llm):
    intent_prompt = f"""
                        Given this natural language question from a renter:
                        "{query}"

                        Classify it into one of the following intents:
                        1. nearest_place
                        2. commute_time
                        3. public_transport_time
                        4. distance_to_location

                        Just return the intent id (e.g., nearest_place).
                    """
    return (await llm.ainvoke(intent_prompt)).content.strip()

# --------------------------
# 🗣️ Main Agent Handler
# --------------------------
async def handle_query(lat, lon, query, llm):
    intent = await classify_intent(query, llm)
    print(f"Classified intent: {intent}")

    if intent == "nearest_place":
        # Extract type from query using LLM
        type_prompt = f"""
                        Extract the Google Maps place type keyword from this query:
                        "{query}"

                        Use values like 'school', 'pharmacy', 'hospital', 'convenience_store', etc.
                        Just return the keyword.
                    """
        place_type = (await llm.ainvoke(type_prompt)).content.strip()
        place = await get_nearby_place(lat, lon, place_type)
        print(f"Found place: {place}")
        if place:
            prompt = f"""
                        A renter asked: "{query}"

                        You found this nearby place:
                        - Name: {place['name']}
                        - Type: {place_type}
                        - Location: {place.get('vicinity', 'N/A')}
                        - Distance: Approx. {place.get('distance', 'unknown')} (assumed within 1 km)

                        Generate a helpful natural language response.
                    """
            return (await llm.ainvoke(prompt)).content.strip()
        else:
            return "I couldn't find a relevant nearby place."

    elif intent in ["commute_time", "public_transport_time", "distance_to_location"]:
        mode = "transit" if intent == "public_transport_time" else "driving"

        # Extract destination from query
        destination_prompt = f"""
                                Extract the destination location name from this query:
                                "{query}"
                                Return only the place name like 'Times Square-42st Station' or 'NYU Brooklyn'.
                            """
        dest_name = (await llm.ainvoke(destination_prompt)).content.strip()
        origin = f"{lat},{lon}"
        destination = await geocode_address(dest_name)
        print(f"Resolved destination: {destination}")
        if not destination:
            return f"I couldn't locate the destination '{dest_name}'."

        directions = await get_directions(origin, destination, mode)
        print(f"Directions: {directions}")
        if directions:
            prompt = f"""
                        A renter asked: "{query}"

                        Here are the route details:
                        - Start: {directions['start_address']}
                        - End: {directions['end_address']}
                        - Mode: {mode}
                        - Distance: {directions['distance']['text']}
                        - Duration: {directions['duration']['text']}
                        - Instructions: {directions['steps'][0]['html_instructions']}...

                        Please generate a clear and friendly response summarizing the commute.
                    """
            return (await llm.ainvoke(prompt)).content.strip()
        else:
            return "I couldn't find a route to the destination."

    else:
        return "Sorry, I couldn't understand the query type."
