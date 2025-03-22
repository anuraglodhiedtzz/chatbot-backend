import db from "../db.js"; // ✅ Import SQLite connection

/**
 * Handles order tracking queries by retrieving order details from SQLite.
 * @param {string} orderID - Extracted Order ID from user message.
 * @returns {Promise<object>} - The response containing order status or an error message.
 */
const orderTrackingAgent = async (orderID) => {
    try {
        if (!orderID) {
            return { reply: "❌ Please provide a valid order ID to track your order." };
        }

        console.log("🔍 Tracking Order ID:", orderID); // Debugging log

        // ✅ Fetch order details from SQLite
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT status, tracking_url FROM orders WHERE order_id = CAST(? AS INTEGER)",
                [orderID],
                (err, row) => {
                    if (err) {
                        console.error("❌ SQLite Query Error:", err);
                        reject({ reply: "⚠️ Error retrieving order details. Try again later." });
                    } else if (row) {
                        resolve({
                            reply: `📦 Your order **#${orderID}** is currently **'${row.status}'**. 🚚 Track it here: ${row.tracking_url || "N/A"}`,
                        });
                    } else {
                        resolve({ reply: "❌ No order found with this ID. Please check and try again." });
                    }
                }
            );
        });
    } catch (error) {
        console.error("❌ Order Tracking Agent Error:", error);
        return { reply: "⚠️ Something went wrong. Try again later." };
    }
};

export default orderTrackingAgent;