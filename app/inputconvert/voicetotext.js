const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Replace with your OpenAI API key
const apiKey = 'key';

async function transcribeAudio() {
    try {
        // Create a form data object
        const formData = new FormData();
        formData.append('file', fs.createReadStream('sample.mp3'));
        formData.append('model', 'whisper-1');

        // Make the POST request to OpenAI's Whisper API
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            },
        });

        // Save the transcribed text to a file
        fs.writeFileSync('transcription_output.txt', response.data.text);
        console.log('Transcription saved to transcription_output.txt');
    } catch (error) {
        console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
    }
}

// Call the function
transcribeAudio();