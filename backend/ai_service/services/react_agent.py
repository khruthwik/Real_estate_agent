# react_agent.py

import asyncio
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import AzureChatOpenAI

# Import tools
from backend.ai_service.services.query_db_tool import query_db
from backend.ai_service.services.distance_calc import (
    geocode_address,
    get_nearby_place,
    get_directions
)

# ---- Async Wrappers to Sync Functions ----

def geocode_tool(address: str) -> str:
    """Wrapper to get lat/lon for a given address."""
    result = asyncio.run(geocode_address(address))
    return str(result) if result else "No coordinates found for that location."

def nearby_places_tool(input_str: str) -> str:
    """Wrapper to find nearby places given lat/lon and type."""
    args = eval(input_str)
    result = asyncio.run(get_nearby_place(args['lat'], args['lon'], args['place_type']))
    return str(result) if result else "No nearby place found."

def directions_tool(input_str: str) -> str:
    """Wrapper to get directions between origin and destination."""
    args = eval(input_str)
    result = asyncio.run(get_directions(args['origin'], args['destination']))
    return str(result) if result else "No directions found between those coordinates."

# ---- Tool Definitions ----

tools = [
    query_db,
    Tool(
        name="GeocodeLocation",
        func=geocode_tool,
        description="Get the coordinates (latitude and longitude) of a location. Input should be a plain address string."
    ),
    Tool(
        name="NearbyPlaces",
        func=nearby_places_tool,
        description="Find the nearest place of a specific type near coordinates. Input should be a dict string with lat, lon, and place_type."
    ),
    Tool(
        name="GetDirections",
        func=directions_tool,
        description="Get route directions between two coordinates. Input should be a dict string with 'origin' and 'destination' as 'lat,lon'."
    )
]

# ---- Main Entry Point ----

async def run_react_agent(user_input: str, llm: AzureChatOpenAI, memory: ConversationBufferMemory) -> str:
    """
    Executes the ReAct-style agent with memory and tools.
    """
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
        memory=memory,
        verbose=True,
        handle_parsing_errors=True
    )
    return await agent.arun(user_input)
