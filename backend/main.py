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
    mode: str

def build_prompt(text: str, mode: str) -> str:
    if mode == "Student":
        return f"Explain this simply for a student: {text}"
    elif mode == "Research":
        return f"Analyze methodology and findings of this: {text}"
    elif mode == "Executive":
        return f"Give 5 key takeaways from this: {text}"
    else:
        return f"Summarize this: {text}"

@app.post("/summarize")
async def summarize(request: SummarizeRequest):
    prompt = build_prompt(request.text, request.mode)
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}"},
            json={
                "model": "google/gemma-4-31b-it:free",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        data = response.json()
        if "choices" in data:
            return {"summary": data["choices"][0]["message"]["content"]}
        else:
            return {"summary": "Error: " + str(data.get("error", {}).get("message", "Unknown error"))}