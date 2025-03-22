import sqlite3 from "sqlite3"; // ✅ Correct
import { open } from "sqlite"; // ✅ Required for Promises

const db = await open({
    filename: "./orders.db",
    driver: sqlite3.Database,
});

export default db;
