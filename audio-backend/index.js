const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors')
require('dotenv').config(); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000
app.use(cors({origin:'http://localhost:4200'}));
const upload = multer({ dest: 'uploads/' });

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/api/audio', upload.single('audio'), async (req, res) => {
  try {
      console.log(req.file); // Log the uploaded file
      const audioFilePath = req.file.path;

      const transcription = await convertAudioToText(audioFilePath);
      const response = await getGenerativeAIResponse(transcription);
      res.json({ response });
  } catch (error) {
      console.error('Error processing audio:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

const convertAudioToText = async (filePath) => {
    // Implement your speech-to-text logic here (e.g., using Google Cloud Speech-to-Text)
    // For now, return a dummy text for demonstration
    return "This is a dummy transcription of the audio."; // Replace with actual transcription logic
};

const getGenerativeAIResponse = async (text) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([text]);

    if (result.response && result.response.candidates && result.response.candidates.length > 0) {
        const generatedContent = result.response.candidates[0];
        const generatedText = generatedContent.content.parts[0].text;
        const codeOnly = generatedText.split('**Explanation:**')[0].trim(); // Clean the output
        return codeOnly.replace(/```python|```|```javascript/g, '').trim(); // Clean up formatting
    }

    throw new Error('No valid candidates returned');
};

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
});
