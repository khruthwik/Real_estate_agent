from typing import Any
from pymongo import MongoClient
import os
import re
from typing import Tuple
import json

from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/ai_service/.env")

<<<<<<< HEAD
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database(os.getenv("MONGO_DB_NAME"))
collection = db.get_collection(os.getenv("MONGO_COLLECTION"))
=======
client = MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3")
db = client.get_database("test")
collection = db.get_collection("properties")
>>>>>>> origin/main

def should_search_db(user_input: str, llm, overall_system_prompt, history: list) -> Tuple[bool, str]:
    with open("backend/ai_service/prompts/decision_prompt.txt", "r") as file:
        decision_prompt = file.read()

    # Convert message history to a string
    history_str = "\n".join([f"{msg.type.upper()}: {msg.content}" for msg in history])

    # Fill the template
    prompt = decision_prompt.format(user_input=user_input, history=history_str, system_prompt=overall_system_prompt)
    
    response = llm.predict(prompt).strip().upper()
    decision = extract_decision(response)

    if decision == "YES DATABASE SEARCH WILL HELP":
        return True, response
    elif decision == "NO DATABASE SEARCH WON'T HELP":
        return False, response
    else:
        # Handle unexpected responses safely
        return False, f"Unrecognized decision response: {response}"


def extract_decision(response: str) -> str:
    # Extracts the final decision string from the LLM output.
    match = re.search(r"(YES database search will help|NO database search won't help)", response.strip(), re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return "UNKNOWN"

def generate_mongo_query(user_input: str, llm_reasoning: str, llm) -> dict:
    # Generate a MongoDB filter dictionary from user input using prompt + reasoning

    with open("backend/ai_service/prompts/queryGen_prompt.txt", "r") as file:
        prompt_template = file.read()

    final_prompt = prompt_template.format(user_input=user_input, llm_reasoning=llm_reasoning)

    response = llm.predict(final_prompt)
    print("LLM raw query output:", response)

    try:
        parsed = json.loads(response)
        print("Parsed query dict:", parsed)
        return parsed
    except Exception as e:
        print("Failed to eval LLM response:", e)
        return {}

def query_db(mongo_query: dict) -> Any:
    return list(collection.find(mongo_query, {"_id": 0}).limit(5))