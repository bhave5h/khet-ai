import pandas as pd
import numpy as np
import os
import joblib
from datetime import datetime
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# ---------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------
DATA_PATH = "data/cp.csv"
MODEL_PATH = "models/CP.h5"
ENCODER_PATH = "models/CP_price_label_encoders.pkl"
SCALER_PATH = "models/CP_price_scaler.pkl"

# ---------------------------------------------------------------------
# LOAD DATA
# ---------------------------------------------------------------------
print("📥 Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Parse date column
df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')

# Drop rows with invalid or missing data
df.dropna(subset=['state', 'district', 'market', 'crop', 'variety', 'date', 'price_per_kg'], inplace=True)
print(f"✅ Dataset loaded with {len(df)} records")

# ---------------------------------------------------------------------
# FEATURE ENGINEERING
# ---------------------------------------------------------------------
df['month'] = df['date'].dt.month
df['year'] = df['date'].dt.year
df['day_of_week'] = df['date'].dt.dayofweek

categorical_cols = ['state', 'district', 'market', 'crop', 'variety']
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Save encoders
os.makedirs("models", exist_ok=True)
joblib.dump(encoders, ENCODER_PATH)
print("✅ Label encoders saved")

# Define features and target
X = df[categorical_cols + ['month', 'year', 'day_of_week']]
y = df['price_per_kg']

# Scale numeric data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, SCALER_PATH)
print("✅ Feature scaler saved")

# ---------------------------------------------------------------------
# TRAIN TEST SPLIT
# ---------------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ---------------------------------------------------------------------
# BUILD MODEL
# ---------------------------------------------------------------------
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(1)  # output: price
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# ---------------------------------------------------------------------
# TRAIN MODEL
# ---------------------------------------------------------------------
print("🚀 Training model...")
es = EarlyStopping(patience=10, restore_best_weights=True)
history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=100,
    batch_size=32,
    callbacks=[es],
    verbose=1
)

# ---------------------------------------------------------------------
# SAVE MODEL
# ---------------------------------------------------------------------
model.save(MODEL_PATH)
print(f"✅ Model saved at {MODEL_PATH}")

# ---------------------------------------------------------------------
# EVALUATE MODEL
# ---------------------------------------------------------------------
loss, mae = model.evaluate(X_test, y_test, verbose=0)
print(f"📊 Model Evaluation: MAE = {mae:.2f}")
