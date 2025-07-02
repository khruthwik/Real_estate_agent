import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

# Load Mongo credentials
load_dotenv(dotenv_path="ai_service/.env")

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB_NAME")]
collection = db[os.getenv("MONGO_COLLECTION")]

# Load listings from JSON file
with open("sample_listings.json") as f:
    listings = json.load(f)

# Insert into MongoDB
result = collection.insert_many(listings)
print(f"✅ Inserted {len(result.inserted_ids)} listings into the database.")
