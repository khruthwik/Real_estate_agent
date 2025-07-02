from langchain_openai import AzureChatOpenAI
from langchain.memory import ConversationBufferMemory
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