import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"; // Import axios
import chatbotRoutes from "./routes/chatbot.js"; // Import chatbot routes
import classifyIntent from "./intentClassifier.js"; // Import Intent Classifier

dotenv.config(); // Load environment variables

const app = express();

// 🔥 FIX: Set up CORS to allow requests from any origin
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Use the chatbot route
app.use("/chatbot", chatbotRoutes);

// AI Chat Endpoint with Intent Classification
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    // Step 1: Classify User Intent
    const intent = classifyIntent(message);
    console.log(`📌 Detected Intent: ${intent}`);

    // Step 2: Route message based on Intent
    if (intent === "greeting") {
        return res.json({ reply: "Hello! How can I assist you today?" });
    } else if (intent === "order_tracking") {
        return res.json({ reply: "Please provide your order ID for tracking." });
    } else if (intent === "faq") {
        return res.json({ reply: "I can help with FAQs. What would you like to ask?" });
    }

    // Step 3: If no specific intent, send to Gemini AI
    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
