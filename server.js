import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import intentClassifier from "./intentClassifier.js"; // ✅ Intent Classifier
import ordersRouter from "./routes/ordersRoutes.js"; // ✅ Orders API for tracking
import "./agents/orderTrackingAgent.js"; // ✅ Load Order Tracking Agent

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware Setup
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// ✅ Chatbot Route
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

// ✅ Orders API Route (For Order Tracking)
app.use("/api/orders", ordersRouter);

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("AI Chatbot Backend is running 🚀");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
