from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)
load_dotenv()
mongo = os.environ.get("mongouri")
client = MongoClient(mongo)
db = client["NiftyReactive"]
collection = db["Records"]

'''
    sample_data = [
        {"Ticker": "NIFTY12124", "Date": "2022-02-10", "Time": "13:37", "Open": 9.35, "High": 9.35, "Low": 9.35, "Close": 9.35, "Volume": 50, "OI": 227475},
        {"Ticker": "NIFTY12125", "Date": "2022-02-11", "Time": "14:00", "Open": 10.50, "High": 11.00, "Low": 10.00, "Close": 10.80, "Volume": 60, "OI": 300000}
    ]
 '''


# Get all the records
@app.route('/optionData', methods=['GET'])
def get_all():
    data  = list(collection.find({}))
    if len(data) != 0:
        totalOpen = 0
        totalClose = 0
        totalHigh = 0
        totalLow = 0

# calculating the totals in the server side itself
        for item in data:
            totalClose += item['Close']
            totalOpen += item['Open']
            totalHigh += item['High']
            totalLow += item['Low']
            item['_id'] = str(item['_id'])
        
        # im then appending the total values to the main data 
        data["total_high"] = totalHigh
        data["total_low"] = totalLow
        data["total_open"] = totalOpen
        data["total_close"] = totalClose

        return jsonify({"message":"success","data":data}), 200
    else:
        return jsonify({"error": "No Records Found"}), 404


# Get data by ID
@app.route("/optionData/<string:ticker>", methods=['GET'])
def get_by_id(ticker):
    data = collection.find_one({"Ticker":ticker}, {"_id":0})

    if data:
        return jsonify({"message":"success","data":data}), 200
    else:
        return jsonify({"error": "Data not found"}), 404

# Create new data
@app.route('/optionData', methods=['POST'])
def create():
    data = request.get_json()
    items = ["Ticker", "Date", "Time", "Open", "High", "Low", "Close", "Volume", "OI"]
    for item in items:
        if item not in data:
            return jsonify({"error": "Missing Data fields"}), 400
    
    collection.insert_one(data)


    return jsonify({"message":"Data inserted successfully"}), 201

# Update data by ticker
@app.route('/optionData/<string:ticker>', methods=['PUT'])
def update(ticker):
    data = request.get_json()
    result = collection.update_one({"Ticker": ticker}, {"$set": data})
    if result.modified_count:
        return jsonify({"message": "Record updated successfully"}), 200
    else:
        return jsonify({"message": "Data not found"}), 404

# Delete data by ticker
@app.route('/optionData/<string:ticker>', methods=['DELETE'])
def delete_by_id(ticker):
    result  = collection.delete_one({"Ticker":ticker})
    if result.deleted_count:
        return jsonify({"message": "Record deleted successfully"}), 200
    else:
        return jsonify({"error": "Data not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
