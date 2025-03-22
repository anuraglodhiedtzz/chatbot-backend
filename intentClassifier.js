import { GoogleGenerativeAI } from "@google/generative-ai";
import orderTrackingAgent from "./agents/orderTrackingAgent.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Classifies user intent and extracts the order ID if present.
 * @param {string} message - The user's message.
 * @returns {Promise<Object>} - Response object.
 */
const classifyIntent = async (message) => {
    try {
        // ✅ Step 1: Check if message is JUST an order ID (Numbers only)
        if (/^\d+$/.test(message.trim())) {
            return await orderTrackingAgent(message.trim());
        }

        // ✅ Step 2: Gemini AI Prompt (STRICT JSON)
        const prompt = `Classify the user's intent and extract the order ID if present.
        Supported intents: order_status, greeting, faq, product_recommendation, payment, memory.
        If order ID is missing for order_status, reply with {"intent": "ask_for_order_id"}.
        Respond ONLY in a valid JSON format. Example:
        {"intent": "order_status", "orderID": "123456"}`;

        const result = await model.generateContent(`${prompt}\nUser: ${message}\nAI:`);
        const aiResponse = await result.response.text();

        console.log("🛠️ Raw AI Response:", aiResponse);

        // ✅ Step 3: Parse Gemini response safely
        let intent, orderID;
        try {
            const parsedResponse = JSON.parse(aiResponse.match(/\{.*\}/s)?.[0] || "{}"); // Extract JSON safely
            intent = parsedResponse.intent || "unknown";
            orderID = parsedResponse.orderID || null;
        } catch (error) {
            console.error("❌ Gemini JSON Parsing Error:", error);
            return { reply: "⚠️ AI response was invalid. Try again later." };
        }

        // ✅ Step 4: Handle Order Tracking
        if (intent === "order_status" && orderID) {
            return await orderTrackingAgent(orderID);
        }
        if (intent === "ask_for_order_id") {
            return { reply: "❌ Please provide your order ID so I can track it for you!" };
        }

        // ✅ Step 5: Handle Other Intents
        const intentResponses = {
            greeting: "👋 Hello! How can I assist you today?",
            faq: "📌 You can ask me common questions about your orders!",
            product_recommendation: "🎯 Looking for recommendations? Let me help!",
            payment: "💳 Need help with payments? Let me know!",
        };

        return { reply: intentResponses[intent] || "🤖 I'm still learning! Ask me something else." };
    } catch (error) {
        console.error("❌ Intent Classifier Error:", error);
        return { reply: "⚠️ Something went wrong. Try again later." };
    }
};

export default classifyIntent;
