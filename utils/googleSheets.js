import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let credentials;

// Load credentials from JSON file
async function loadCredentials() {
    try {
        const credentialsPath = path.resolve("google-sheets-credentials.json");
        const credentialsData = fs.readFileSync(credentialsPath, "utf8");
        credentials = JSON.parse(credentialsData);
        console.log("✅ Google Sheets credentials loaded successfully!");
    } catch (error) {
        console.error("❌ Error loading Google Sheets credentials:", error);
        process.exit(1);
    }
}

await loadCredentials(); // Load credentials at startup

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

async function accessSpreadsheet() {
    try {
        // Authenticate using service account credentials
        await doc.useServiceAccountAuth({
            client_email: credentials.client_email,
            private_key: credentials.private_key.replace(/\\n/g, "\n"), // Fix newline issue
        });

        await doc.loadInfo(); // Loads spreadsheet info
        console.log("✅ Google Sheets authentication successful!");

        return doc.sheetsByIndex[0]; // ✅ Returns the first sheet
    } catch (error) {
        console.error("❌ Google Sheets Authentication Error:", error);
        throw new Error("Failed to access Google Sheets");
    }
}

export default accessSpreadsheet;
