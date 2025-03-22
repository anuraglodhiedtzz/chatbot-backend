import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function initDB() {
    return await open({
        filename: "./orders.db",
        driver: sqlite3.Database,
    });
}

const db = await initDB(); // ✅ Now inside a function

export default db;
