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

@chat_router.post("/")
async def chat_endpoint(input: ChatInput):
    
    memory = get_memory(input.session_id)
    reply = await get_chat_response(input.message, input.session_id)
    memory.chat_memory.add_user_message(input.message)
    memory.chat_memory.add_ai_message(reply)
    
    full_chat_history = memory.chat_memory.messages
    profile = await extract_user_profile(full_chat_history)  
   
    result = await extract_matching_properties(input.message+reply)  

    print("User Profile:", profile)
    print("Chat Reply:", reply)

    
    print("Matching Properties:", result)


    return {
        "reply": reply,
        "profile": profile,
        "matches":result,
    }