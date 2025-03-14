import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
            {
                contents: [{ parts: [{ text: message }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    key: process.env.GEMINI_API_KEY, // Use Gemini API Key from .env
                }
            }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
        res.json({ reply });

    } catch (error) {
        console.error("Error communicating with Gemini:", error?.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong while contacting Gemini AI!" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
