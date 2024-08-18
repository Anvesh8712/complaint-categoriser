import base64
import requests

# OpenAI API Key
api_key = "key"

# Function to encode the imagegit
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Path to your image
image_path = "inputconvert/irlsample.png"

# Getting the base64 string
base64_image = encode_image(image_path)

headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {api_key}"
}

payload = {
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this image and determine if it contains a complaint. If it does, convert the complaint to plain text. Also, describe what the image is showing us in detail."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{base64_image}"
          }
        }
      ]
    }
  ],
  "max_tokens": 300
}


response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

print(response.json())

response_json = response.json()

output_text = str(response_json)
with open("inputconvert/transcription_output.txt", "w") as text_file:
    text_file.write(output_text)