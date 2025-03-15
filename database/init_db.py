import sqlite3

# Connect to SQLite database (creates the file if it doesn't exist)
conn = sqlite3.connect("database/orders.db")
cursor = conn.cursor()

# Create orders table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL
)
""")

# Insert some sample orders (You can modify these later)
sample_orders = [
    ("ORD123", "Shipped"),
    ("ORD124", "In Transit"),
    ("ORD125", "Delivered"),
    ("ORD126", "Pending"),
]

# Insert orders into the table (ignore duplicates)
cursor.executemany("INSERT OR IGNORE INTO orders (order_id, status) VALUES (?, ?)", sample_orders)

# Commit changes and close connection
conn.commit()
conn.close()

print("✅ Database initialized successfully with sample orders!")
