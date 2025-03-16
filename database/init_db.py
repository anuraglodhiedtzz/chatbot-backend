import sqlite3

# Connect to SQLite database (stores inside 'database/' folder)
conn = sqlite3.connect("database/orders.db")  
cursor = conn.cursor()

# Create 'orders' table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    tracking_url TEXT DEFAULT 'Not Available'
)
""")

# Insert sample orders (Modify as needed)
sample_orders = [
    ("ORD123", "Shipped", "http://track.com/ORD123"),
    ("ORD124", "In Transit", "http://track.com/ORD124"),
    ("ORD125", "Delivered", "http://track.com/ORD125"),
    ("ORD126", "Pending", "http://track.com/ORD126"),
]

# Insert only if they don’t already exist
cursor.executemany("INSERT OR IGNORE INTO orders (order_id, status, tracking_url) VALUES (?, ?, ?) ", sample_orders)

# Save and close
conn.commit()
conn.close()

print("✅ Database initialized successfully!")
