from models import generate_orders
from flask import Flask


def create_app():
    # Create a flask app
    app = Flask(__name__)

    # generate 500 orders using the function
    ORDERS = generate_orders(500)

    from routes import register_routes
    register_routes(app, ORDERS)

    return app