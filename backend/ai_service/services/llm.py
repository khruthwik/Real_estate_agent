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
    print(response)
    input_2 = f"""
                You're a wrapper, read the response and check for any bad framing of the response content. 
                If there is a logical error, reframe the response to make it more clear and concise.
                If NOT, pass the response AS IT IS:
                
                Errors may inlcude like saying the same thing twice, or the response message in not cohesive and flow of the message is not good.
                Response: 
                {response}

                [OUTPUT FORMAT]
                Include only the contents of the response, without any additional text or explanation.
                """
    response2 = await llm.ainvoke(input_2)
    return response2.content