from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv 
import os 

load_dotenv('/Users/siddhant/Desktop/Briefly/backend/.env')
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app= FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
class SummarizeRequest (BaseModel):
    text: str 
    mode: str 
def build_prompt(text: str, mode: str) ->str :
    if mode == "Student":
        return f"Explain this simply for a student:{text}"
    elif mode == "Research":
        return f"Analyze methodology and findings of this: {text}"
    elif mode == "Executive":
        return f"Give 5 key takeaways from this: {text}"
    else:
        return f"Summarize this: {text}"
@app.post ("/summarize")
async def summarize(request: SummarizeRequest):
    prompt = build_prompt(request.text, request.mode)
    response = client.models.generate_content(
    model="gemini-2.0-flash-lite",
    contents= prompt
    )
    return {"summary": response.text}
