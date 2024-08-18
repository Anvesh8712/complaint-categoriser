// voicetotext.js
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Replace with your OpenAI API key
const apiKey = process.env.local;

async function transcribeAudio(filePath) { // Accept file path as a parameter
    try {
        // Create a form data object
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath)); // Use the file path provided
        formData.append('model', 'whisper-1');

        // Make the POST request to OpenAI's Whisper API
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            },
        });

        return response.data.text; // Return the transcribed text
    } catch (error) {
        console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { transcribeAudio };