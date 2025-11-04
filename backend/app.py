# import os
# os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
# os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# import joblib
# import pandas as pd
# import numpy as np
# import warnings
# warnings.filterwarnings("ignore", message="Do not pass an `input_shape`")
# warnings.filterwarnings("ignore", message="Compiled the loaded model")
# warnings.filterwarnings("ignore", message="Error in loading the saved optimizer state")
# warnings.filterwarnings("ignore", message="Compiled the loaded model")
# warnings.filterwarnings("ignore", message="Error in loading the saved optimizer state")
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from sklearn.exceptions import DataConversionWarning

# # Suppress sklearn harmless warnings
# warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
# warnings.filterwarnings("ignore", category=DataConversionWarning)

# app = Flask(__name__)
# CORS(app)

# # 🌾 SECTION 1: CROP RECOMMENDATION
# try:
#     CR_model = joblib.load("models/CR.pkl")
#     print("✅ Crop Recommendation Model loaded.")
# except Exception as e:
#     print(f"❌ Error loading Crop Recommendation Model: {e}")
#     CR_model = None


# @app.route("/recommend", methods=["POST"])
# def recommend_crop():
#     """Recommend best crop based on soil and weather data"""
#     if CR_model is None:
#         return jsonify({"error": "Crop model not loaded"}), 500
#     try:
#         data = request.get_json()
#         X = np.array([[ 
#             float(data["nitrogen"]),
#             float(data["phosphorus"]),
#             float(data["potassium"]),
#             float(data["temperature"]),
#             float(data["humidity"]),
#             float(data["ph"]),
#             float(data["rainfall"]),
#         ]])
#         prediction = CR_model.predict(X)
#         return jsonify({"recommended_crop": prediction[0]})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# # 🌱 SECTION 2: CROP YIELD PREDICTION
# try:
#     yield_data = joblib.load("models/CY.pkl")  # now contains model + features
#     yield_model = yield_data["model"]
#     yield_features = yield_data["features"]
#     print("✅ Crop Yield Model loaded (single file).")
# except Exception as e:
#     print(f"❌ Error loading Yield Model: {e}")
#     yield_model, yield_features = None, []

# # Load crop list (optional, for frontend dropdown)
# try:
#     df = pd.read_csv("data/CY_crop_yield.csv")
#     crop_list = sorted(df["Crop"].dropna().unique().tolist())
# except Exception as e:
#     print(f"⚠️ Error loading crop list: {e}")
#     crop_list = []


# @app.route("/predict_yield", methods=["POST"])
# def predict_yield():
#     """Predict yield based on inputs"""
#     if yield_model is None:
#         return jsonify({"error": "Yield model not loaded"}), 500
#     try:
#         data = request.get_json()
#         crop = data.get("cropType", "").strip()
#         season = data.get("season", "").strip()
#         area = float(data.get("area", 0))
#         rainfall = float(data.get("rainfall", 0))
#         temperature = float(data.get("temperature", 0))
#         pesticides = float(data.get("pesticides", 0))
#         fertilizers = float(data.get("fertilizers", 0))

#         print(f"🧩 Received: {data}")

#         # Prepare input DataFrame
#         input_df = pd.DataFrame([{
#             "Crop": crop,
#             "Season": season,
#             "Area": area,
#             "Annual_Rainfall": rainfall,
#             "Temperature": temperature,
#             "Pesticide": pesticides,
#             "Fertilizer": fertilizers,
#         }])

#         # One-hot encode and align with training features
#         input_encoded = pd.get_dummies(input_df)
#         input_aligned = input_encoded.reindex(columns=yield_features, fill_value=0)

#         # Predict
#         prediction = yield_model.predict(input_aligned)
#         return jsonify({"predicted_yield": round(float(prediction[0]), 2)})
#     except Exception as e:
#         print(f"❌ Prediction error: {e}")
#         return jsonify({"error": f"Prediction failed: {str(e)}"}), 400


# @app.route("/crops", methods=["GET"])
# def get_crops():
#     """Return list of unique crops"""
#     return jsonify({"crops": crop_list})


# # 🌿 SECTION 3: FERTILIZER RECOMMENDATION
# try:
#     CF_model = joblib.load("models/CF.pkl")
#     print("✅ Fertilizer Recommendation Model loaded.")
# except Exception as e:
#     print(f"❌ Error loading Fertilizer Model: {e}")
#     CF_model = None


# @app.route("/fertilizer", methods=["POST"])
# def recommend_fertilizer():
#     """Recommend fertilizer based on NPK values"""
#     if CF_model is None:
#         return jsonify({"error": "Fertilizer model not loaded"}), 500
#     try:
#         data = request.get_json()
#         X = np.array([[ 
#             float(data["nitrogen"]),
#             float(data["phosphorus"]),
#             float(data["potassium"])
#         ]])
#         prediction = CF_model.predict(X)
#         return jsonify({"recommended_fertilizer": prediction[0]})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# @app.route("/predict_disease", methods=["POST"])
# def predict_disease():
#     if "file" not in request.files:
#         return jsonify({"error": "No image file provided"}), 400

#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "Empty filename"}), 400

#     try:
#         # Save temp image
#         image_path = os.path.join("uploads", file.filename)
#         os.makedirs("uploads", exist_ok=True)
#         file.save(image_path)

#         # Load and preprocess image
#         img = load_img(image_path, target_size=(128, 128))
#         img_array = img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)

#         # Predict using trained model
#         predictions = model.predict(img_array)
#         predicted_class_idx = int(np.argmax(predictions[0]))
#         confidence = float(np.max(predictions[0])) * 100

#         # Load classes
#         with open("models/PD_classes.pkl", "rb") as f:
#             class_names = pickle.load(f)

#         predicted_class = class_names[predicted_class_idx]

#         # Top 3 predictions
#         top_3_idx = np.argsort(predictions[0])[-3:][::-1]
#         top_3 = [
#             {"class": class_names[i], "confidence": round(float(predictions[0][i]) * 100, 2)}
#             for i in top_3_idx
#         ]

#         # Clean up file
#         os.remove(image_path)

#         return jsonify({
#             "prediction": predicted_class,
#             "confidence": round(confidence, 2),
#             "top_3": top_3
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # 🚀 RUN APP
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)


"""
Khet AI - Unified Flask Backend
Includes:
🌾 Crop Recommendation
🌱 Crop Yield Prediction
🌿 Fertilizer Recommendation
🍃 Plant Disease Detection
"""

# ============================================================
# Environment Setup
# ============================================================
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# ============================================================
# Imports
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
# Warning Suppression
# ============================================================
warnings.filterwarnings("ignore", message="Do not pass an `input_shape`")
warnings.filterwarnings("ignore", message="Compiled the loaded model")
warnings.filterwarnings("ignore", message="Error in loading the saved optimizer state")
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
warnings.filterwarnings("ignore", category=DataConversionWarning)

# ============================================================
# Flask Initialization
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


# ============================================================
# 🌱 SECTION 2: CROP YIELD PREDICTION
# ============================================================
try:
    yield_data = joblib.load("models/CY.pkl")  # Contains model + features
    yield_model = yield_data["model"]
    yield_features = yield_data["features"]
    print("✅ Crop Yield Model loaded (single file).")
except Exception as e:
    print(f"❌ Error loading Yield Model: {e}")
    yield_model, yield_features = None, []

# Optional: Load crop list for frontend dropdown
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
    """Return list of available crops"""
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
        X = np.array([[
            float(data["nitrogen"]),
            float(data["phosphorus"]),
            float(data["potassium"])
        ]])
        prediction = CF_model.predict(X)
        return jsonify({"recommended_fertilizer": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ============================================================ 
# 🍃 SECTION 4: PLANT DISEASE DETECTION
# ============================================================

import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array

try:
    PD_MODEL_PATH = os.path.join("models", "PD_model.h5")

    model = tf.keras.models.load_model(PD_MODEL_PATH)
    print("✅ Plant Disease Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading Plant Disease Model: {e}")
    model = None

# Class names used during training
PD_CLASS_NAMES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'PlantVillage',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

# ---------------------- ROUTE: Predict Plant Disease ---------------------- #
@app.route("/predict_disease", methods=["POST"])
def predict_disease():
    """Predict plant disease from uploaded image."""
    if model is None:
        return jsonify({"error": "Disease model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    try:
        # --- Save uploaded image temporarily ---
        os.makedirs("uploads", exist_ok=True)
        image_path = os.path.join("uploads", file.filename)
        file.save(image_path)

        # --- Preprocess image ---
        img = load_img(image_path, target_size=(128, 128))
        img_array = img_to_array(img) / 255.0  # normalize
        img_array = np.expand_dims(img_array, axis=0)

        # --- Run prediction ---
        predictions = model.predict(img_array)
        predictions = np.nan_to_num(predictions)  # replace NaNs if any

        predicted_idx = int(np.argmax(predictions[0]))
        confidence = round(float(np.max(predictions[0])) * 100, 2)
        predicted_class = PD_CLASS_NAMES[predicted_idx]

        # --- Top 3 predictions ---
        top_3_idx = np.argsort(predictions[0])[-3:][::-1]
        top_3 = [
            {
                "class": PD_CLASS_NAMES[i],
                "confidence": round(float(predictions[0][i]) * 100, 2)
            }
            for i in top_3_idx
        ]

        # --- Cleanup temporary file ---
        os.remove(image_path)

        # --- Return structured JSON ---
        return jsonify({
            "prediction": predicted_class,
            "confidence": confidence,
            "top_3": top_3
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Disease prediction failed: {str(e)}"}), 500


# ============================================================
# 🚀 RUN SERVER
# ============================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
