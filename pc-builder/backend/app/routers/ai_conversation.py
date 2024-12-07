from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel
from typing import Optional
import uuid
from ..services.ai_service import PCBuilderConversationService
import json

router = APIRouter(prefix="/ai", tags=["ai conversation"])

# Initialize AI service
ai_service = PCBuilderConversationService()

class ConversationResponse(BaseModel):
    session_id: str
    message: str

@router.websocket("/conversation")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time conversation with the AI agent.
    """
    await websocket.accept()
    session_id = str(uuid.uuid4())
    
    try:
        # Set up callbacks for the conversation
        async def on_agent_response(response: str):
            await websocket.send_json({
                "type": "agent_response",
                "text": response
            })
        
        async def on_agent_correction(original: str, corrected: str):
            await websocket.send_json({
                "type": "agent_correction",
                "original": original,
                "corrected": corrected
            })
        
        async def on_user_transcript(transcript: str):
            await websocket.send_json({
                "type": "user_transcript",
                "text": transcript
            })
        
        # Create and start conversation
        conversation = ai_service.create_conversation(
            session_id=session_id,
            on_agent_response=on_agent_response,
            on_agent_correction=on_agent_correction,
            on_user_transcript=on_user_transcript
        )
        
        # Send session info to client
        await websocket.send_json({
            "type": "session_start",
            "session_id": session_id
        })
        
        # Start the conversation
        ai_service.start_conversation(session_id)
        
        # Listen for client messages
        while True:
            try:
                message = await websocket.receive_text()
                data = json.loads(message)
                
                if data.get("type") == "end":
                    # End the conversation gracefully
                    conversation_id = ai_service.end_conversation(session_id)
                    await websocket.send_json({
                        "type": "session_end",
                        "conversation_id": conversation_id
                    })
                    break
                
            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "message": str(e)
                })
                break
                
    except Exception as e:
        if session_id in ai_service.active_conversations:
            ai_service.end_conversation(session_id)
        await websocket.close(code=1000, reason=str(e))
    
    finally:
        if session_id in ai_service.active_conversations:
            ai_service.end_conversation(session_id)
        await websocket.close() 