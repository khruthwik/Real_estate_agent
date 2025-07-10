from langchain.tools import tool
from pymongo import MongoClient
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv("backend/ai_service/.env")

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB_NAME")]
collection = db.get_collection(os.getenv("MONGO_COLLECTION"))

@tool
def query_db(
    location: str,
    bedrooms: int,
    price_max: int,
    bathrooms: Optional[int] = None,
    furnished: Optional[bool] = None,
    pets_allowed: Optional[bool] = None,
    studio: Optional[bool] = None
) -> str:
    """
    Search NYC apartment listings. Required: location, bedrooms, price_max.
    Optional: bathrooms, furnished, pets_allowed, studio.
    Returns top matches with price, beds, baths, and location.
    """
    query = {
        "location": { "$regex": location, "$options": "i" },
        "bedrooms": { "$gte": bedrooms },
        "price": { "$lte": price_max }
    }

    if bathrooms is not None:
        query["bathrooms"] = { "$gte": bathrooms }
    if furnished is not None:
        query["furnished"] = furnished
    if pets_allowed is not None:
        query["pets_allowed"] = pets_allowed
    if studio is not None:
        query["studio"] = studio

    projection = {
        "_id": 0, "price": 1, "bedrooms": 1, "bathrooms": 1, "location": 1
    }

    results = list(collection.find(query, projection).limit(5))
    if not results:
        return "No listings matched those criteria."

    return "\n".join(
        f"- ${r['price']} – {r['bedrooms']} BR, {r['bathrooms']} Bath – {r['location']}"
        for r in results
    )
