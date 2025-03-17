import spacy

# Load the spaCy model once for efficiency
nlp = spacy.load("en_core_web_sm")

# Define intent categories
intents = {
    "greeting": ["hello", "hi", "hey", "good morning", "good evening"],
    "farewell": ["bye", "goodbye", "see you", "take care"],
    "order_status": ["track my order", "order status", "where is my package"],
    "faq": ["how does this work", "what are your services", "help", "support"],
}

def classify_intent(message):
    """Classifies user message into an intent."""
    doc = nlp(message.lower())

    for intent, keywords in intents.items():
        if any(keyword in message.lower() for keyword in keywords):
            return intent

    return "unknown"  # Default fallback intent

# ✅ Test the function (Optional)
if __name__ == "__main__":
    test_message = "Hey, can you help me?"
    print("Detected Intent:", classify_intent(test_message))
