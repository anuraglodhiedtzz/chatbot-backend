import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import chatbotRoutes from "./routes/chatbot.js";
import classifyIntent from "./intentClassifier.js";

dotenv.config();

const app = express();

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/chatbot", chatbotRoutes);

let db;
(async () => {
    db = await open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
    console.log("📦 SQLite Database connected!");
})();

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    const intent = classifyIntent(message);
    console.log(`📌 Detected Intent: ${intent}`);

    if (intent === "greeting") {
        return res.json({ reply: "Hello! How can I assist you today?" });
    } else if (intent === "order_tracking") {
        const orderIDMatch = message.match(/\d+/);
        if (!orderIDMatch) {
            return res.json({ reply: "Please provide your order ID to track your order." });
        }
        const orderID = orderIDMatch[0];
        try {
            const order = await db.get("SELECT * FROM orders WHERE order_id = ?", [orderID]);
            if (order) {
                return res.json({
                    reply: `Your order #${orderID} is currently '${order.status}'. Tracking link: ${order.tracking_url}`,
                });
            } else {
                return res.json({ reply: "No order found with this ID. Please check and try again." });
            }
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ reply: "Error retrieving order details. Try again later." });
        }
    } else if (intent === "faq") {
        return res.json({ reply: "I can help with FAQs. What would you like to ask?" });
    }

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            { contents: [{ parts: [{ text: message }] }] },
            { headers: { "Content-Type": "application/json" }, params: { key: process.env.GEMINI_API_KEY } }
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
