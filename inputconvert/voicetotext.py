import openai

# Replace with your OpenAI API key
openai.api_key = "key"

# Open the .m4a audio file
audio_file = open("inputconvert/sample.mp3", "rb")

# Transcribe the audio file
transcription = openai.Audio.transcribe(
    model="whisper-1",  # or use the specific model you prefer
    file=audio_file
)

# Save the transcribed text to a file
with open("inputconvert/transcription_output.txt", "w") as text_file:
    text_file.write(transcription["text"])

print("Transcription saved to transcription_output.txt")