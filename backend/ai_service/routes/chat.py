from fastapi import APIRouter, Request
from pydantic import BaseModel
from backend.ai_service.services.llm import get_chat_response

chat_router = APIRouter()

class ChatInput(BaseModel):
    message: str
    session_id: str = "default"

@chat_router.post("/")
async def chat_endpoint(input: ChatInput):
    response = await get_chat_response(input.message, input.session_id)
    return {"reply": response}