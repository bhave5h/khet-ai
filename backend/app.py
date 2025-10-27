from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import warnings
from sklearn.exceptions import DataConversionWarning

# Suppress sklearn harmless warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
warnings.filterwarnings("ignore", category=DataConversionWarning)

app = Flask(__name__)
CORS(app)

# 🌾 SECTION 1: CROP RECOMMENDATION
try:
    CR_model = joblib.load("models/CR.pkl")
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
try:
    yield_data = joblib.load("models/CY.pkl")  # now contains model + features
    yield_model = yield_data["model"]
    yield_features = yield_data["features"]
    print("✅ Crop Yield Model loaded (single file).")
except Exception as e:
    print(f"❌ Error loading Yield Model: {e}")
    yield_model, yield_features = None, []

# Load crop list (optional, for frontend dropdown)
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

        # Prepare input DataFrame
        input_df = pd.DataFrame([{
            "Crop": crop,
            "Season": season,
            "Area": area,
            "Annual_Rainfall": rainfall,
            "Temperature": temperature,
            "Pesticide": pesticides,
            "Fertilizer": fertilizers,
        }])

        # One-hot encode and align with training features
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


# 🌿 SECTION 3: FERTILIZER RECOMMENDATION
try:
    CF_model = joblib.load("models/CF.pkl")
    print("✅ Fertilizer Recommendation Model loaded.")
except Exception as e:
    print(f"❌ Error loading Fertilizer Model: {e}")
    CF_model = None


@app.route("/fertilizer", methods=["POST"])
def recommend_fertilizer():
    """Recommend fertilizer based on NPK values"""
    if CF_model is None:
        return jsonify({"error": "Fertilizer model not loaded"}), 500
    try:
        data = request.get_json()
        X = np.array([[ 
            float(data["nitrogen"]),
            float(data["phosphorus"]),
            float(data["potassium"])
        ]])
        prediction = CF_model.predict(X)
        return jsonify({"recommended_fertilizer": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 🚀 RUN APP
if __name__ == "__main__":
    app.run(debug=True, port=5000)
