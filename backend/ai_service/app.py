<<<<<<< HEAD
=======

>>>>>>> origin/main
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.ai_service.routes.chat import chat_router

app = FastAPI()
<<<<<<< HEAD

=======
>>>>>>> origin/main
# Allow CORS from frontend and JS backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register chat route
app.include_router(chat_router, prefix="/chat")

<<<<<<< HEAD
=======
print("AI service is running...")

>>>>>>> origin/main
@app.get("/")
def read_root():
    return {"message": "AI service is running."}
