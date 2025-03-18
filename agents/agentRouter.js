import orderTrackingAgent from "./orderTrackingAgent.js";
import faqAgent from "./faqAgent.js";
import memoryAgent from "./memoryAgent.js";
import productRecommendationAgent from "./productRecommendationAgent.js";
import paymentAgent from "./paymentAgent.js";

/**
 * Routes the request to the correct AI agent based on intent.
 * @param {string} intent - The classified intent of the user message.
 * @param {string} message - The user message.
 * @returns {Promise<string>} - The chatbot's response.
 */
const routeToAgent = async (intent, message) => {
    try {
        switch (intent) {
            case "order_status":
                return await orderTrackingAgent(message);

            case "faq":
                return await faqAgent(message);

            case "memory":
                return await memoryAgent(message);

            case "product_recommendation":
                return await productRecommendationAgent(message);

            case "payment":
                return await paymentAgent(message);

            default:
                return "I'm not sure how to respond. Can you clarify?";
        }
    } catch (error) {
        console.error("❌ Agent Router Error:", error);
        return "⚠️ Error processing your request. Please try again later.";
    }
};

export default routeToAgent;
