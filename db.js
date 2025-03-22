import sqlite3 from "sqlite3";
import { open } from "sqlite";

// ✅ Open SQLite database connection
const db = await open({
    filename: "./orders.db",
    driver: sqlite3.Database,
});

// ✅ Export as default
export default db;
