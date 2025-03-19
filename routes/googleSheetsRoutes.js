import express from "express";
import { accessSpreadsheet } from "../utils/googleSheets.js";  // Updated to use named export

const router = express.Router();

// ✅ GET Order by Order ID
router.get("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const sheet = await accessSpreadsheet();
        const rows = await sheet.getRows();

        const order = rows.find(row => row.OrderID === orderId);
        if (order) {
            return res.json({
                OrderID: order.OrderID,
                Status: order.Status,
                TrackingURL: order.TrackingURL,
            });
        } else {
            return res.status(404).json({ message: "❌ Order not found." });
        }
    } catch (error) {
        console.error("Google Sheets Error:", error);
        return res.status(500).json({ message: "⚠️ Error retrieving order." });
    }
});

// ✅ POST Add New Order
router.post("/orders", async (req, res) => {
    try {
        const { OrderID, Status, TrackingURL } = req.body;
        if (!OrderID || !Status || !TrackingURL) {
            return res.status(400).json({ message: "⚠️ Missing required fields." });
        }

        const sheet = await accessSpreadsheet();
        await sheet.addRow({ OrderID, Status, TrackingURL });

        return res.json({ message: "✅ Order added successfully!" });
    } catch (error) {
        console.error("Google Sheets Error:", error);
        return res.status(500).json({ message: "⚠️ Error adding order." });
    }
});

// ✅ PUT Update Order Status
router.put("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { Status, TrackingURL } = req.body;

        const sheet = await accessSpreadsheet();
        const rows = await sheet.getRows();

        const order = rows.find(row => row.OrderID === orderId);
        if (!order) {
            return res.status(404).json({ message: "❌ Order not found." });
        }

        if (Status) order.Status = Status;
        if (TrackingURL) order.TrackingURL = TrackingURL;
        await order.save();

        return res.json({ message: "✅ Order updated successfully!" });
    } catch (error) {
        console.error("Google Sheets Error:", error);
        return res.status(500).json({ message: "⚠️ Error updating order." });
    }
});

// ✅ DELETE Remove an Order
router.delete("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        const sheet = await accessSpreadsheet();
        const rows = await sheet.getRows();

        const orderIndex = rows.findIndex(row => row.OrderID === orderId);
        if (orderIndex === -1) {
            return res.status(404).json({ message: "❌ Order not found." });
        }

        await rows[orderIndex].delete();
        return res.json({ message: "✅ Order deleted successfully!" });
    } catch (error) {
        console.error("Google Sheets Error:", error);
        return res.status(500).json({ message: "⚠️ Error deleting order." });
    }
});

export default router;
