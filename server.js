import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import intentClassifier from "./intentClassifier.js"; // ✅ Updated to use the new intent classifier
import googleSheetsRouter from "./routes/googleSheetsRoutes.js"; // ✅ Google Sheets API routes
import bodyParser from "body-parser";

// ✅ Import orderTrackingAgent.js to ensure it's loaded
import "./agents/orderTrackingAgent.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware Setup Hello World
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// ✅ Routes
app.post("/api/chatbot", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await intentClassifier(message);
        res.json(response);
    } catch (error) {
        console.error("❌ Error in chatbot route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.use("/api/google-sheets", googleSheetsRouter); // ✅ Google Sheets API routes

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("AI Chatbot Backend is running 🚀");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
