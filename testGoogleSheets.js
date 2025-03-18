import accessSpreadsheet from "./utils/googleSheets.js";

(async () => {
    try {
        const sheet = await accessSpreadsheet();
        console.log(`✅ Connected to sheet: ${sheet.title}`);

        // Fetch some sample rows
        const rows = await sheet.getRows();
        console.log(`📄 Found ${rows.length} rows in the sheet.`);
    } catch (error) {
        console.error("❌ Error accessing Google Sheets:", error);
    }
})();
