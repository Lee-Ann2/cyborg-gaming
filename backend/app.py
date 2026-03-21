from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/search")
def search_user():
    username = request.args.get("username")
    return jsonify({
        "username": username,
        "status": "User Found (Demo Response)"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)