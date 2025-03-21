import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

// ✅ Authenticate using Google JWT
const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ✅ Connect to Google Sheets
export const accessSpreadsheet = async () => {
    await doc.useServiceAccountAuth(auth);
    await doc.loadInfo();
    return doc.sheetsByIndex[0]; // First sheet
};

// ✅ Fetch Order Details
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
        return null;
    } catch (error) {
        console.error("❌ Error fetching order details:", error);
        return null;
    }
};
