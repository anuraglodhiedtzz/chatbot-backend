import express from "express";
import intentClassifier from '../intentClassifier.js'; // Adjust the path to go up to the root directory
import orderTrackingAgent from "../agents/orderTrackingAgent.js";

const router = express.Router();

/**
 * Handles chatbot messages and routes them based on intent.
 */
router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ reply: "❌ Please enter a valid message." });
        }

        // ✅ Classify user intent
        const intent = await classifyIntent(message);
        let response;

        // ✅ Route message to the appropriate agent based on intent
        switch (intent) {
            case "order_status":
                response = await orderTrackingAgent(message);
                break;
            default:
                response = { reply: "🤖 I'm still learning! Ask me something else." };
        }

        return res.json(response);
    } catch (error) {
        console.error("❌ Chatbot Route Error:", error);
        return res.status(500).json({ reply: "⚠️ Something went wrong. Try again later." });
    }
});

export default router;
