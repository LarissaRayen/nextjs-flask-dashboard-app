from datetime import datetime, timedelta
import random

def generate_orders(n=500):
    products = [
        ("Laptop", "Electronics", 1200),
        ("Phone", "Electronics", 800),
        ("Headphones", "Electronics", 150),
        ("T-Shirt", "Fashion", 40),
        ("Shoes", "Fashion", 90),
        ("Book", "Books", 25),
        ("Watch", "Accessories", 200),
        ("Backpack", "Accessories", 60)
    ]

    orders = []

    start_date = datetime(2025, 1, 1)

    for i in range(n):
        product, category, base_price = random.choice(products)

        order = {
            "id": i + 1,
            "customerId": random.randint(1, 120),
            "product": product,
            "category": category,
            "amount": round(base_price * random.uniform(0.8, 1.5), 2),
            "createdAt": (start_date + timedelta(days=random.randint(0, 365))).isoformat()
        }

        orders.append(order)

    return orders