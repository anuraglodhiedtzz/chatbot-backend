import express from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";
import classifyIntent from "../intentClassifier.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// ✅ FIXED: Load Google Sheets credentials using fs.readFileSync()
let credentials;

async function loadCredentials() {
    try {
        const credentialsPath = path.resolve("google-sheets-credentials.json");
        const credentialsData = fs.readFileSync(credentialsPath, "utf8");
        credentials = JSON.parse(credentialsData);
        console.log("✅ Google Sheets credentials loaded successfully!");
    } catch (error) {
        console.error("❌ Error loading credentials:", error);
        process.exit(1); // Stop execution if credentials fail to load
    }
}

await loadCredentials(); // 🔥 Load credentials before using them

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

async function accessSpreadsheet() {
    try {
        await doc.useServiceAccountAuth(credentials);
        await doc.loadInfo();
        return doc.sheetsByIndex[0]; // ✅ First sheet contains order data
    } catch (error) {
        console.error("❌ Google Sheets Authentication Error:", error);
        throw new Error("Failed to access Google Sheets");
    }
}

// ✅ Chatbot Route
const router = express.Router();

router.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
        const intent = await classifyIntent(message);
        console.log(`📌 Detected Intent: ${intent}`);

        if (intent === "greeting") {
            return res.json({ reply: "Hello! How can I assist you today?" });
        } 
        else if (intent === "order_status") {
            try {
                const sheet = await accessSpreadsheet();
                const rows = await sheet.getRows();

                // ✅ Extract Order ID
                const orderIDMatches = message.match(/\d+/g);
                if (!orderIDMatches) {
                    return res.json({ reply: "Please provide your order ID to track your order." });
                }
                const orderID = orderIDMatches[0];

                // ✅ Search for order in Google Sheets
                const order = rows.find(row => row.OrderID === orderID);

                if (order) {
                    return res.json({
                        reply: `📦 Your order #${orderID} is currently '${order.Status}'. Track it here: ${order.TrackingURL}`,
                    });
                } else {
                    return res.json({ reply: "❌ No order found with this ID. Please check and try again." });
                }
            } catch (error) {
                console.error("Google Sheets error:", error);
                return res.status(500).json({ reply: "⚠️ Error retrieving order details. Try again later." });
            }
        } 
        else if (intent === "faq") {
            return res.json({ reply: "I can help with FAQs. What would you like to ask?" });
        }

        // ✅ Default case - Send request to Gemini AI
        return res.json({ reply: "I'm not sure how to respond. Can you clarify?" });
    } catch (error) {
        console.error("Intent Classification error:", error);
        return res.status(500).json({ reply: "⚠️ Error classifying your message. Please try again later." });
    }
});

export default router;
