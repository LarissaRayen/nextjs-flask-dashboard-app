from flask import Flask, jsonify


def register_routes(app, ORDERS):

    @app.route("/api/orders")
    def get_orders():
        return jsonify(ORDERS)
