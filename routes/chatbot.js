import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
            {
                contents: [{ parts: [{ text: userMessage }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    key: process.env.GEMINI_API_KEY, // Use Gemini API Key from .env
                },
            }
        );

        // Extract the reply from the Gemini API response
        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
        
        res.json({ reply });
    } catch (error) {
        console.error("Error communicating with Gemini:", error.message);
        res.status(500).json({ reply: "Sorry, something went wrong!" });
    }
});

export default router;
