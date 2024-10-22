const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:4200" }));

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage });

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/api/audio", upload.single("audio"), async (req, res) => {
    try {
        console.log("Received request to /api/audio");
        const audioFilePath = req.file.path;

        const transcription = await convertAudioToText(audioFilePath);
        console.log("Transcription:", transcription); // Log transcription for debugging
        const response = await getGenerativeAIResponse(transcription);
        console.log("Generative AI Response:", response); // Log the response
        res.json({ response });
    } catch (error) {
        console.error("Error processing audio:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const convertAudioToText = async (filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }
    // Implement your speech-to-text logic here (e.g., using Google Cloud Speech-to-Text)
    // For now, return a dummy text for demonstration
    return "This is a dummy transcription of the audio."; // Replace with actual transcription logic
};

const getGenerativeAIResponse = async (text) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([text]);

    if (
        result.response &&
        result.response.candidates &&
        result.response.candidates.length > 0
    ) {
        const generatedContent = result.response.candidates[0];
        const generatedText = generatedContent.content.parts[0].text;
        const codeOnly = generatedText.split("**Explanation:**")[0].trim(); // Clean the output
        return codeOnly.replace(/```python|```|```javascript/g, "").trim(); // Clean up formatting
    }

    throw new Error("No valid candidates returned");
};

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:5000");
});
