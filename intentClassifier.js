import natural from "natural";

const tokenizer = new natural.WordTokenizer();

// ✅ Define intents and their keyword patterns
const intents = {
    greeting: ["hello", "hi", "hey", "greetings"],
    order_status: ["order", "track", "tracking", "shipment", "delivered"],
    faq: ["how", "what", "why", "when", "where", "faq", "question"],
    product_recommendation: ["recommend", "suggest", "buy", "best"],
    payment: ["pay", "payment", "refund", "price", "cost"],
    memory: ["remember", "recall", "save", "note"]
};

/**
 * Classifies the intent of a given message.
 * @param {string} message - The user message.
 * @returns {Promise<string>} - The classified intent.
 */
const classifyIntent = async (message) => {
    const tokens = tokenizer.tokenize(message.toLowerCase());

    for (const [intent, keywords] of Object.entries(intents)) {
        if (tokens.some(token => keywords.includes(token))) {
            return intent;
        }
    }

    return "unknown"; // Default if no intent is matched
};

export default classifyIntent;
