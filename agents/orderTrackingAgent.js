import { getOrderDetails } from "../utils/googleSheets.js";

/**
 * Handles order tracking queries by retrieving order details from Google Sheets.
 * @param {string} message - User's query.
 * @returns {Promise<object>} - The response containing order status or an error message.
 */
const orderTrackingAgent = async (message) => {
    try {
        const orderIDMatches = message.match(/\d+/g);
        if (!orderIDMatches) {
            return { reply: "❌ Please provide your order ID to track your order." };
        }
        const orderID = orderIDMatches[0];

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
