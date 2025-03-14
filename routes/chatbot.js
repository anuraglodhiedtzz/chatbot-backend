import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        const openaiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            },
            {
                headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            }
        );

        res.json({ reply: openaiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
