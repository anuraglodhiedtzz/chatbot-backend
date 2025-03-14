import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"; // Import axios
import chatbotRoutes from "./routes/chatbot.js"; // Import chatbot routes

dotenv.config(); // Load environment variables

const app = express();

// 🔥 FIX: Set up CORS to allow requests from your frontend
const corsOptions = {
    origin: "*", // Allow only your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Use the chatbot route
app.use("/chatbot", chatbotRoutes);

// Gemini AI Chat Endpoint
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
