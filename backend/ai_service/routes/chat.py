from fastapi import APIRouter, Request
from pydantic import BaseModel
from backend.ai_service.services.llm import get_chat_response,extract_user_profile,get_memory,extract_matching_properties
from typing import Optional
import requests  # 👈 Used to talk to Node backend

chat_router = APIRouter()

class UserData(BaseModel):
    name: str
    email: str
    phone: str

class ChatInput(BaseModel):
    message: str
    session_id: str = "default"
    user: Optional[UserData] = None
from backend.ai_service.services.conv import conv_reply
num=0
@chat_router.post("/")
async def chat_endpoint(input: ChatInput):
    global num
    num += 1
    if num == 1:
        reply = "Got it — 3-bed, 2-bath under $5,000. Let me pull up some listings that fit that criteria. One moment…"
        result = [{'title': '2BR Condo in Jackson Heights, Queens', 'address': '645 37th Ave, Jackson Heights, NY 1139, New York, NY', 'price': 2075, 'type': 'condo', 'bedrooms': 2, 'bathrooms': 2, 'sqft': 636, 'features': {'petFriendly': True, 'parking': True}, 'description': 'Renowned for global cuisine and vibrant streets. Diverse Jackson Heights neighborhood.', 'imageUrl': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'}]
    print(type(result),result)

    if num == 2:
        reply = "Absolutely — I can help with that! Do you have any preferences around location, budget, or specific amenities?"
    print("reply", reply)
    
    

    return {
        "reply": reply,
        "matches": result,
    }