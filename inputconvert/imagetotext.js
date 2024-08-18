const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// OpenAI API Key
const apiKey = "key";

// Function to encode the image
function encodeImage(imagePath) {
    const image = fs.readFileSync(imagePath);
    return image.toString('base64');
}

// Path to your image
const imagePath = path.join(__dirname, "irlsample.png");

// Getting the base64 string
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

fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
})
    .then(response => response.json())
    .then(responseJson => {
        console.log(responseJson);
        fs.writeFileSync("transcription_output.txt", JSON.stringify(responseJson));
    })
    .catch(error => {
        console.error("Error:", error);
    });