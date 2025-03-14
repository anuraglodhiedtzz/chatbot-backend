import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatbotRoutes from "./routes/chatbot.js"; // Import chatbot routes

dotenv.config(); // Load environment variables

const app = express();

// 🔥 FIX: Set up CORS to allow requests from your frontend
const corsOptions = {
    origin: "https://chatbot-ui-p5sz.vercel.app", // Allow only your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Use the chatbot route
app.use("/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
