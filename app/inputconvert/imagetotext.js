// Use ES module syntax for imports
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Correctly imported using ESM syntax

// OpenAI API Key
const apiKey = process.env.local; // replace with your actual API key

// Function to encode the image
function encodeImage(imagePath) {
    const image = fs.readFileSync(imagePath);
    return image.toString('base64');
}

// Function to transcribe the image using OpenAI
async function transcribeImage(imagePath) {
    const base64Image = encodeImage(imagePath);

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const payload = {
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
                            "url": `data:image/jpeg;base64,${base64Image}`
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
    });

    const responseJson = await response.json();

    // Write the transcription result to a file or return it
    fs.writeFileSync("transcription_output.txt", JSON.stringify(responseJson, null, 2));

    return responseJson;
}

// Export the transcribeImage function
export { transcribeImage };