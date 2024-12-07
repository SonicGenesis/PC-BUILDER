import os
import signal
import sys
from typing import Optional, Callable
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface
from dotenv import load_dotenv

load_dotenv()

class PCBuilderConversationService:
    def __init__(self):
        self.agent_id = "UYJvsVnkn7JN4SfGvuBR"
        self.api_key = "sk_519cabad7f5adb70b0400cc288446fde92c59d5393edb5f1"
        
        if not self.agent_id:
            raise ValueError("AGENT_ID environment variable must be set")
        
        if not self.api_key:
            print("Warning: ELEVENLABS_API_KEY not set, assuming the agent is public")
        
        self.client = ElevenLabs(api_key=self.api_key)
        self.active_conversations = {}

    def create_conversation(
        self,
        session_id: str,
        on_agent_response: Optional[Callable[[str], None]] = None,
        on_agent_correction: Optional[Callable[[str, str], None]] = None,
        on_user_transcript: Optional[Callable[[str], None]] = None
    ) -> Conversation:
        """Create a new conversation session."""
        conversation = Conversation(
            self.client,
            self.agent_id,
            requires_auth=bool(self.api_key),
            audio_interface=DefaultAudioInterface(),
            callback_agent_response=on_agent_response or (lambda response: print(f"Agent: {response}")),
            callback_agent_response_correction=on_agent_correction or (
                lambda original, corrected: print(f"Agent: {original} -> {corrected}")
            ),
            callback_user_transcript=on_user_transcript or (lambda transcript: print(f"User: {transcript}"))
        )
        
        self.active_conversations[session_id] = conversation
        return conversation

    def start_conversation(self, session_id: str) -> None:
        """Start a conversation session."""
        if session_id not in self.active_conversations:
            raise ValueError(f"No conversation found for session {session_id}")
        
        conversation = self.active_conversations[session_id]
        conversation.start_session()

    def end_conversation(self, session_id: str) -> str:
        """End a conversation session and return the conversation ID."""
        if session_id not in self.active_conversations:
            raise ValueError(f"No conversation found for session {session_id}")
        
        conversation = self.active_conversations[session_id]
        conversation.end_session()
        conversation_id = conversation.wait_for_session_end()
        
        # Clean up
        del self.active_conversations[session_id]
        
        return conversation_id

    def cleanup(self):
        """End all active conversations."""
        for session_id in list(self.active_conversations.keys()):
            try:
                self.end_conversation(session_id)
            except Exception as e:
                print(f"Error cleaning up conversation {session_id}: {str(e)}")

    def __del__(self):
        """Ensure all conversations are cleaned up."""
        self.cleanup() 