import os
import signal
import sys
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs # type: ignore
from elevenlabs.conversational_ai.conversation import Conversation # type: ignore
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface # type: ignore

def main():
    # Load environment variables
    load_dotenv()
    
    AGENT_ID = "UYJvsVnkn7JN4SfGvuBR"
    API_KEY = "sk_519cabad7f5adb70b0400cc288446fde92c59d5393edb5f1"

    if not AGENT_ID:
        sys.stderr.write("AGENT_ID environment variable must be set\n")
        sys.exit(1)
    
    if not API_KEY:
        sys.stderr.write("ELEVENLABS_API_KEY not set, assuming the agent is public\n")

    print("Initializing ElevenLabs client...")
    client = ElevenLabs(api_key=API_KEY)
    
    def on_agent_response(response):
        print(f"\nAgent: {response}")
    
    def on_correction(original, corrected):
        print(f"\nCorrection: {original} -> {corrected}")
    
    def on_transcript(transcript):
        print(f"\nUser said: {transcript}")

    print("Creating conversation...")
    conversation = Conversation(
        client,
        AGENT_ID,
        requires_auth=bool(API_KEY),
        audio_interface=DefaultAudioInterface(),
        callback_agent_response=on_agent_response,
        callback_agent_response_correction=on_correction,
        callback_user_transcript=on_transcript
    )

    print("\nStarting conversation session...")
    print("Speak to the AI (Press Ctrl+C to end)")
    conversation.start_session()

    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        print("\nEnding conversation...")
        conversation.end_session()
        conversation_id = conversation.wait_for_session_end()
        print(f"Conversation ID: {conversation_id}")
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    
    # Keep the script running
    try:
        signal.pause()
    except AttributeError:
        # Windows doesn't support signal.pause()
        while True:
            pass

if __name__ == '__main__':
    main() 