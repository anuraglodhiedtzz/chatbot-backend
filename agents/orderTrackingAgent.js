import { getOrderDetails } from "../utils/googleSheets.js";

/**
 * Handles order tracking queries by retrieving order details from Google Sheets.
 * @param {string} orderID - Extracted Order ID from user message.
 * @returns {Promise<object>} - The response containing order status or an error message.
 */
const orderTrackingAgent = async (orderID) => {
    try {
        if (!orderID) {
            return { reply: "❌ Please provide a valid order ID to track your order." };
        }

        // ✅ Fetch order details from Google Sheets
        const orderDetails = await getOrderDetails(orderID);

        if (orderDetails) {
            return {
                reply: `📦 Your order **#${orderID}** is currently **'${orderDetails.status}'**. 🚚 Track it here: ${orderDetails.trackingURL}`
            };
        } else {
            return { reply: "❌ No order found with this ID. Please check and try again." };
        }
    } catch (error) {
        console.error("❌ Order Tracking Agent Error:", error);
        return { reply: "⚠️ Error retrieving order details. Try again later." };
    }
};

export default orderTrackingAgent;
