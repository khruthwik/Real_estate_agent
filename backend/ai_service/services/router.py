from backend.ai_service.services.search import should_search_db, generate_mongo_query, query_db
from langchain.chat_models.base import BaseChatModel
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.chains import LLMChain

async def route_user_input(user_input: str, llm: BaseChatModel, memory: ConversationBufferMemory):

    print("USER INPUT:", user_input)

<<<<<<< Updated upstream
<<<<<<< HEAD
    with open("backend/ai_service/prompts/system_prompt.txt", "r") as file:
=======
    with open("backend/ai_service/prompts/temp.txt", "r") as file:
>>>>>>> origin/main
=======
    with open("backend/ai_service/prompts/system_prompt2.txt", "r") as file:
>>>>>>> Stashed changes
        instructions_prompt = file.read()
    
    with open("backend/ai_service/prompts/basic_listing_info.txt", "r") as file:
        listings = file.read()

    with open("backend/ai_service/prompts/Apartment_Conversations.txt", "r") as file:
        conv = file.read()

    instructions = instructions_prompt.format(listings=listings, examples=conv)

    system_prompt = SystemMessagePromptTemplate.from_template(
        instructions
    )

    prompt = ChatPromptTemplate.from_messages([
        system_prompt,
        MessagesPlaceholder(variable_name="history"),
        HumanMessagePromptTemplate.from_template("{input}")
    ])

    # Step 1: Decide whether DB search is needed
    decision, response = should_search_db(user_input, llm, overall_system_prompt=instructions, history=memory.chat_memory.messages)

    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=True
    )

    print(decision, response)

    if decision:
        # Step 2: Create MongoDB query from user input
        mongo_query = generate_mongo_query(user_input, response, llm)
        print("MONGO QUERY:",mongo_query)

        # Step 2a: Query the database using MongoDB directly
        db_result = query_db(mongo_query)

        # # Step 2b: Generate final response using user input + db results
        # new_input = f"User asked: '{user_input}'. Database results: {db_result}."
        
        # return await chain.arun(input=new_input)

        final_prompt = prompt.format_messages(
            input=f"""
            [Database Results]
            Below are the results from the database search based on the user's request:
            {db_result}.

            User asked: '{user_input}'. 
            """,
            history=memory.chat_memory.messages
        )

        print("CONVERSATION HISTORY:",memory.chat_memory.messages)
        print("FINAL PROMPT:", final_prompt)

        ai_output = await llm.ainvoke(final_prompt)
        response_text = ai_output.content

        # Step 4: Manually update memory with clean input/output
        memory.chat_memory.add_user_message(user_input)
        memory.chat_memory.add_ai_message(response_text)

        return response_text
    else:
        # Step 3: Fallback to LLM-only response
        final_prompt = prompt.format_messages(
            input=f"""
            [Database Results]
            No database search was performed as it was deemed unnecessary by the search engine. So format the response based on the user input and the overall system prompt.

            User asked: '{user_input}'.
            """,
            history=memory.chat_memory.messages
        )
        
        print("CONVERSATION HISTORY:",memory.chat_memory.messages)
        print("FINAL PROMPT:", final_prompt)

        ai_output = await llm.ainvoke(final_prompt)
        response_text = ai_output.content

        # Step 4: Manually update memory with clean input/output
        memory.chat_memory.add_user_message(user_input)
        memory.chat_memory.add_ai_message(response_text)

        return response_text