from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
import os

load_dotenv('/Users/siddhant/Desktop/Briefly/backend/.env')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class SummarizeRequest(BaseModel):
    text: str

@app.post("/summarize")
async def summarize(request: SummarizeRequest):
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}"},
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": f"Summarize this clearly and concisely: {request.text}"}]
            }
        )
        data = response.json()
        if "choices" in data:
            return {"summary": data["choices"][0]["message"]["content"]}
        else:
            return {"summary": "Error: " + str(data.get("error", {}).get("message", "Unknown error"))}