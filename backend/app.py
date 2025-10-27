from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# 🌾 SECTION 1: CROP RECOMMENDATION

# --- Load Crop Recommendation Model ---
try:
    CR_model = joblib.load("models/CR_RF_model.pkl")
    print("✅ Crop Recommendation Model loaded.")
except Exception as e:
    print(f"❌ Error loading Crop Recommendation Model: {e}")
    CR_model = None


@app.route("/recommend", methods=["POST"])
def recommend_crop():
    """Recommend best crop based on soil and weather data"""
    if CR_model is None:
        return jsonify({"error": "Crop model not loaded"}), 500
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
        prediction = CR_model.predict(X)
        return jsonify({"recommended_crop": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400



# 🌱 SECTION 2: CROP YIELD PREDICTION

# --- Load Yield Model + Feature Columns + Crop List ---
try:
    yield_model = joblib.load("models/CY.pkl")
    yield_features = joblib.load("models/CY_features.pkl")
    print("✅ Crop Yield Model loaded.")
except Exception as e:
    print(f"❌ Error loading Yield Model: {e}")
    yield_model, yield_features = None, []

try:
    df = pd.read_csv("data/CY_crop_yield.csv")
    crop_list = sorted(df["Crop"].dropna().unique().tolist())
except Exception as e:
    print(f"⚠️ Error loading crop list: {e}")
    crop_list = []


@app.route("/predict_yield", methods=["POST"])
def predict_yield():
    """Predict yield based on inputs"""
    if yield_model is None:
        return jsonify({"error": "Yield model not loaded"}), 500

    try:
        data = request.get_json()
        crop = data.get("cropType", "").strip()
        season = data.get("season", "").strip()
        area = float(data.get("area", 0))
        rainfall = float(data.get("rainfall", 0))
        temperature = float(data.get("temperature", 0))
        pesticides = float(data.get("pesticides", 0))
        fertilizers = float(data.get("fertilizers", 0))

        print(f"🧩 Received: {data}")

        # Build input DataFrame
        input_df = pd.DataFrame([{
            "Crop": crop,
            "Season": season,
            "Area": area,
            "Annual_Rainfall": rainfall,
            "Temperature": temperature,
            "Pesticide": pesticides,
            "Fertilizer": fertilizers,
        }])

        # One-hot encode + align columns
        input_encoded = pd.get_dummies(input_df)
        input_aligned = input_encoded.reindex(columns=yield_features, fill_value=0)

        # Predict
        prediction = yield_model.predict(input_aligned)
        return jsonify({"predicted_yield": round(float(prediction[0]), 2)})

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 400


@app.route("/crops", methods=["GET"])
def get_crops():
    """Return list of unique crops"""
    return jsonify({"crops": crop_list})



# 🚀 RUN APP

if __name__ == "__main__":
    app.run(debug=True, port=5000)
