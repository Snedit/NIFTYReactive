from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

optionData = [
    {
        "id": 1,
        "Ticker": "NIFTY12124",
        "Date": "2022-02-10",
        "Time": "13:37",
        "Open": 9.35,
        "High": 9.35,
        "Low": 9.35,
        "Close": 9.35,
        "Volume": 50,
        "OI": 227475,
    },
    {
        "id": 2,
        "Ticker": "NIFTY12124",
        "Date": "2022-02-10",
        "Time": "13:37",
        "Open": 9.35,
        "High": 9.35,
        "Low": 9.35,
        "Close": 9.35,
        "Volume": 50,
        "OI": 227475,
    },
]

# Get all data
@app.route('/optionData', methods=['GET'])
def get_all():
    return jsonify(optionData), 200

# Get data by ID
@app.route("/optionData/<int:id>", methods=['GET'])
def get_by_id(id):
    data = next((item for item in optionData if item["id"] == id), None)
    if data:
        return jsonify(data), 200
    else:
        return jsonify({"message": "Data not found"}), 404

# Create new data
@app.route('/optionData', methods=['POST'])
def create():
    data = request.get_json()
    new_id = max(item["id"] for item in optionData) + 1 if optionData else 1
    data["id"] = new_id
    optionData.append(data)
    return jsonify(data), 201

# Update data by ID
@app.route('/optionData/<int:id>', methods=['PUT'])
def update(id):
    data = next((item for item in optionData if item["id"] == id), None)
    if data:
        updates = request.get_json()
        data.update(updates)
        return jsonify({"message": "Success", "Updated Data": data}), 200
    else:
        return jsonify({"message": "Data not found"}), 404

# Delete data by ID
@app.route('/optionData/<int:id>', methods=['DELETE'])
def delete_by_id(id):
    global optionData
    data = next((item for item in optionData if item["id"] == id), None)
    if data:
        optionData = [item for item in optionData if item["id"] != id]
        return jsonify({"message": "The record has been deleted"}), 200
    else:
        return jsonify({"message": "Data not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
