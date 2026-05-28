from app import create_app
from flask_cors import CORS

flask_app = create_app()

if __name__ == '__main__':
    CORS(flask_app)
    
    flask_app.run(host="0.0.0.0", debug=True)