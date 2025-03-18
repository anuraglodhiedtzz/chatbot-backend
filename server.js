import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatbotRouter from "./routes/chatbotRours.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware Setup
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// ✅ Routes
app.use("/api/chatbot", chatbotRouter); // Main chatbot route

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("AI Chatbot Backend is running 🚀");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
