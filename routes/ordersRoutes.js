import express from "express";
import db from "../db.js"; // ✅ Import database connection

const router = express.Router();

// ✅ Order Tracking API
router.get("/track/:order_id", (req, res) => {
    const orderId = req.params.order_id;

    db.get("SELECT * FROM orders WHERE order_id = ?", [orderId], (err, row) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        } else if (!row) {
            res.status(404).json({ error: "Order not found" });
        } else {
            res.json(row);
        }
    });
});

export default router;
