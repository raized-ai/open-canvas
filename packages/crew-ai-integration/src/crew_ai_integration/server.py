from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from .process import create_crew_process, CrewAIInput

app = FastAPI(title="CrewAI Integration API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/process")
async def process_crew(input_data: CrewAIInput) -> Dict[str, Any]:
    """
    Execute a CrewAI process with the given configuration.
    
    Args:
        input_data: Configuration for the CrewAI process
        
    Returns:
        Results of the CrewAI process
    """
    try:
        result = create_crew_process(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"} 