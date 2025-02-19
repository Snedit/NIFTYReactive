from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)
load_dotenv()
#  storing the mongouri in env to enhance security
mongo = os.environ.get("mongouri")
client = MongoClient(mongo)
# DB name is NiftyReactive
db = client["NiftyReactive"]
# collection name is Records
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
            totalClose += float(item['Close'])
            totalOpen += float(item['Open'])
            totalHigh += float(item['High'])
            totalLow += float(item['Low'])
            item['_id'] = str(item['_id'])
        
        # im then appending the total values to the main data 
        
        print(data)
        return jsonify({"message":"success","data":data,"total_high":totalHigh,"total_low" : totalLow,"total_open": totalOpen, "total_close": totalClose}), 200
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
    print("received", str(data))
    old = collection.find_one({"Ticker":data["Ticker"]})
    if old:
        return jsonify({"error": "Ticker already exists"}), 400
    items = {
        "Ticker": str,
        "Date": str,
        "Time": str,
        "Open": float,
        "High": float,
        "Low": float,
        "Close": float,
        "Volume": int,
        "OI": int
    }
    
    for item, item_type in items.items():
        if item not in data:
            print({"error": f"Missing Data field: {item}"})
            return jsonify({"error": f"Missing Data field: {item}"}), 400
        data["Open"] = float(data["Open"])
        data["High"] = float(data["High"])
        data["Low"] = float(data["Low"])
        data["Close"] = float(data["Close"])
        if not isinstance(data[item], item_type):
            print({"error": f"Incorrect type for field: {item}. Expected {item_type.__name__}"})
            return jsonify({"error": f"Incorrect type for field: {item}. Expected {item_type.__name__}"}), 400
    
    collection.insert_one(data)
    return jsonify({"message": "Data inserted successfully"}), 201

# Update data by ticker
@app.route('/optionData/<string:ticker>', methods=['PUT'])
def update(ticker):
    data = request.get_json()

    if "_id" in data.keys():
        del data["_id"]
        
    print("new data = " + str(data))
    # return jsonify({"message": "Record updated successfully"}), 200
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

@app.route("/health")
def health():
    return jsonify({"message": "Server is up and running"}), 200

@app.route("/")
def home():
    return render_template("index.html")
if __name__ == '__main__':
    app.run(debug=True)
