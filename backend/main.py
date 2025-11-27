import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://path-7lc.pages.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STEAM_API_KEY = os.getenv("STEAM_API_KEY")
WITCHER_3_APP_ID = "292030"

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Witcher Command Center Backend"}

@app.get("/api/steam/achievements/{steam_id}")
async def get_achievements(steam_id: str):
    if not STEAM_API_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration: STEAM_API_KEY not set")

    url = "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/"
    params = {
        "appid": WITCHER_3_APP_ID,
        "key": STEAM_API_KEY,
        "steamid": steam_id
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            if not data.get("playerstats"):
                raise HTTPException(status_code=404, detail="Achievements not found. Check if profile is public.")
                
            return data["playerstats"]
            
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 403:
                raise HTTPException(status_code=403, detail="Steam Profile is Private")
            raise HTTPException(status_code=e.response.status_code, detail="Steam API Error")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
