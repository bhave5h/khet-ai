from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow React to access this backend

# Load your trained model
MODEL_PATH = "random_forest_crop_model.pkl"
model = joblib.load(MODEL_PATH)

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        X = np.array([[
            float(data["nitrogen"]),
            float(data["phosphorus"]),
            float(data["potassium"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"]),
        ]])
        prediction = model.predict(X)
        return jsonify({"recommended_crop": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Run on port 5000
