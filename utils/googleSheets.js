import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

// 📌 Connect to Google Sheets
const accessSpreadsheet = async () => {
    await doc.useServiceAccountAuth(serviceAccountAuth);
    await doc.loadInfo();
    return doc.sheetsByIndex[0]; // Assuming orders are in the first sheet
};

// ✅ Get Order Details (Fix for `orderTrackingAgent.js`)
export const getOrderDetails = async (orderID) => {
    try {
        const sheet = await accessSpreadsheet();
        const rows = await sheet.getRows();

        const order = rows.find(row => row.OrderID === orderID);
        if (order) {
            return {
                status: order.Status,
                trackingURL: order.TrackingURL || "🔗 No tracking URL available."
            };
        }
        return null; // No matching order found
    } catch (error) {
        console.error("❌ Error fetching order details:", error);
        return null;
    }
};
