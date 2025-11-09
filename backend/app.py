"""
Khet AI - Unified Flask Backend
Includes:
🌾 Crop Recommendation
🌱 Crop Yield Prediction
🌿 Fertilizer Recommendation
🍃 Plant Disease Detection
💰 Crop Price Prediction
"""

# ============================================================
# 🌍 ENVIRONMENT SETUP
# ============================================================
# import os
# os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = "2"
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = "1"
# os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import os
import warnings
import logging
import tensorflow as tf

# Silence TensorFlow, absl, and Python warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
warnings.filterwarnings("ignore")
logging.disable(logging.CRITICAL)
tf.get_logger().setLevel('ERROR')
tf.autograph.set_verbosity(0)

# Silence Flask logs
logging.getLogger('werkzeug').disabled = True

print("✅ All warnings and logs silenced.")


# ============================================================
# 📦 IMPORTS
# ============================================================
import warnings
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib

from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.exceptions import DataConversionWarning

# ============================================================
# ⚙️ WARNING SUPPRESSION
# ============================================================
warnings.filterwarnings("ignore", message="Do not pass an `input_shape`")
warnings.filterwarnings("ignore", message="Compiled the loaded model")
warnings.filterwarnings("ignore", message="Error in loading the saved optimizer state")
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
warnings.filterwarnings("ignore", category=DataConversionWarning)

# ============================================================
# 🚀 FLASK INITIALIZATION
# ============================================================
app = Flask(__name__)
CORS(app)

# ============================================================
# 🌾 SECTION 1: CROP RECOMMENDATION
# ============================================================
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
        X = np.array([[float(data["nitrogen"]), float(data["phosphorus"]),
                       float(data["potassium"]), float(data["temperature"]),
                       float(data["humidity"]), float(data["ph"]),
                       float(data["rainfall"])]])
        prediction = CR_model.predict(X)
        return jsonify({"recommended_crop": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ============================================================
# 🌱 SECTION 2: CROP YIELD PREDICTION
# ============================================================
try:
    yield_data = joblib.load("models/CY.pkl")  # contains model + features
    yield_model = yield_data["model"]
    yield_features = yield_data["features"]
    print("✅ Crop Yield Model loaded (single file).")
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

        input_df = pd.DataFrame([{
            "Crop": crop, "Season": season, "Area": area,
            "Annual_Rainfall": rainfall, "Temperature": temperature,
            "Pesticide": pesticides, "Fertilizer": fertilizers
        }])

        # one-hot encode & align with training features
        input_encoded = pd.get_dummies(input_df)
        input_aligned = input_encoded.reindex(columns=yield_features, fill_value=0)
        prediction = yield_model.predict(input_aligned)

        return jsonify({"predicted_yield": round(float(prediction[0]), 2)})

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 400


@app.route("/crops", methods=["GET"])
def get_crops():
    return jsonify({"crops": crop_list})


# ============================================================
# 🌿 SECTION 3: FERTILIZER RECOMMENDATION
# ============================================================
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
        X = np.array([[float(data["nitrogen"]),
                       float(data["phosphorus"]),
                       float(data["potassium"])]])
        prediction = CF_model.predict(X)
        return jsonify({"recommended_fertilizer": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ============================================================
# 🍃 SECTION 4: PLANT DISEASE DETECTION
# ============================================================
try:
    PD_MODEL_PATH = "models/CD.h5"
    PD_model = tf.keras.models.load_model(PD_MODEL_PATH)
    print("✅ Plant Disease Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading Plant Disease Model: {e}")
    PD_model = None

PD_CLASS_NAMES = [
    'Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy',
    'PlantVillage', 'Potato___Early_blight', 'Potato___Late_blight',
    'Potato___healthy', 'Tomato_Bacterial_spot', 'Tomato_Early_blight',
    'Tomato_Late_blight', 'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite', 'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]


@app.route("/predict_disease", methods=["POST"])
def predict_disease():
    """Predict plant disease from uploaded image."""
    if PD_model is None:
        return jsonify({"error": "Disease model not loaded"}), 500
    if "file" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    try:
        os.makedirs("uploads", exist_ok=True)
        image_path = os.path.join("uploads", file.filename)
        file.save(image_path)

        img = load_img(image_path, target_size=(128, 128))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        preds = PD_model.predict(img_array)
        preds = np.nan_to_num(preds)

        pred_idx = int(np.argmax(preds[0]))
        confidence = round(float(np.max(preds[0])) * 100, 2)
        predicted_class = PD_CLASS_NAMES[pred_idx]

        top_3_idx = np.argsort(preds[0])[-3:][::-1]
        top_3 = [{"class": PD_CLASS_NAMES[i],
                  "confidence": round(float(preds[0][i]) * 100, 2)}
                 for i in top_3_idx]

        os.remove(image_path)

        return jsonify({
            "prediction": predicted_class,
            "confidence": confidence,
            "top_3": top_3
        })

    except Exception as e:
        return jsonify({"error": f"Disease prediction failed: {str(e)}"}), 500


# ============================================================
# 💰 SECTION 5: CROP PRICE PREDICTION
# ============================================================
from datetime import datetime

CP_DATA_PATH = "data/cp.csv"
CP_MODEL_PATH = "models/CP.h5"
CP_ENCODER_PATH = "models/CP_price_label_encoders.pkl"
CP_SCALER_PATH = "models/CP_price_scaler.pkl"

try:
    CP_price_df = pd.read_csv(CP_DATA_PATH)
    print(f"✅ Price dataset loaded with {len(CP_price_df)} records.")
except Exception as e:
    CP_price_df = pd.DataFrame()
    print(f"⚠️ Failed to load price dataset: {e}")

try:
    CP_model = tf.keras.models.load_model(CP_MODEL_PATH, compile=False)
    CP_encoders = joblib.load(CP_ENCODER_PATH)
    CP_scaler = joblib.load(CP_SCALER_PATH)
    print("✅ Crop Price Model & Preprocessors loaded successfully.")
except Exception as e:
    CP_model = None
    print(f"❌ Error loading CP model: {e}")


def CP_prepare_input(data):
    df = pd.DataFrame([data])
    df["date"] = pd.to_datetime(df["date"], dayfirst=True)
    df["month"] = df["date"].dt.month
    df["year"] = df["date"].dt.year
    df["day_of_week"] = df["date"].dt.dayofweek

    for col in ["state", "district", "market", "crop", "variety"]:
        encoder = CP_encoders.get(col)
        if encoder:
            value = str(df.loc[0, col])
            if value not in encoder.classes_:
                encoder.classes_ = np.append(encoder.classes_, value)
            df[col] = encoder.transform([value])
        else:
            df[col] = 0

    X = df[["state", "district", "market", "crop",
            "variety", "month", "year", "day_of_week"]]
    return CP_scaler.transform(X)


@app.route("/get_states", methods=["GET"])
def get_states():
    try:
        states = sorted(CP_price_df["state"].dropna().unique().tolist())
        return jsonify(states)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_districts/<state>", methods=["GET"])
def get_districts(state):
    try:
        df = CP_price_df[CP_price_df["state"] == state]
        districts = sorted(df["district"].dropna().unique().tolist())
        return jsonify(districts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_markets/<state>/<district>", methods=["GET"])
def get_markets(state, district):
    try:
        df = CP_price_df[(CP_price_df["state"] == state) &
                         (CP_price_df["district"] == district)]
        markets = sorted(df["market"].dropna().unique().tolist())
        return jsonify(markets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_crops/<state>/<district>/<market>", methods=["GET"])
def get_crops_cp(state, district, market):
    try:
        filtered = CP_price_df[
            (CP_price_df["state"].str.lower() == state.lower()) &
            (CP_price_df["district"].str.lower() == district.lower()) &
            (CP_price_df["market"].str.lower() == market.lower())
        ]
        crops = sorted(filtered["crop"].dropna().unique().tolist())
        return jsonify(crops)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_varieties/<state>/<district>/<market>/<crop>", methods=["GET"])
def get_varieties(state, district, market, crop):
    try:
        filtered = CP_price_df[
            (CP_price_df["state"].str.lower() == state.lower()) &
            (CP_price_df["district"].str.lower() == district.lower()) &
            (CP_price_df["market"].str.lower() == market.lower()) &
            (CP_price_df["crop"].str.lower() == crop.lower())
        ]
        varieties = sorted(filtered["variety"].dropna().unique().tolist())
        return jsonify(varieties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict_price", methods=["POST"])
def predict_price():
    if CP_model is None:
        return jsonify({"error": "Model not loaded"}), 500
    try:
        data = request.get_json()
        X_scaled = CP_prepare_input(data)
        predicted_price = float(CP_model.predict(X_scaled)[0][0])
        return jsonify({
            "status": "success",
            "predicted_price_per_kg": round(predicted_price, 2),
            "currency": "INR",
            "unit": "per_kg",
            "input_data": data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# 🏠 ROOT ROUTE
# ============================================================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🌾 Khet AI Backend is running successfully!"})


# ============================================================
# 🚀 RUN SERVER
# ============================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
