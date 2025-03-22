import { open } from "sqlite";
import sqlite3 from "sqlite3";

// ✅ Open SQLite database connection
const db = await open({
    filename: "./orders.db",
    driver: sqlite3.Database, // ✅ Correct Driver
});

export default db;
