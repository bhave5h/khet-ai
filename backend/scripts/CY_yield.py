import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib

# ------------------------- LOAD DATA ------------------------- #
# Load dataset
crop_data = pd.read_csv("../data/CY_predictioncrop.csv")
print("✅ Dataset loaded successfully!")
print(f"Shape: {crop_data.shape}")
print("Columns:", crop_data.columns.tolist())

# ------------------------- CLEANING ------------------------- #
# Handle missing values
print("\nMissing values before cleaning:\n", crop_data.isnull().sum())
crop_data["Production"] = crop_data["Production"].fillna(crop_data["Production"].mean())
print("\n✅ Missing values handled successfully!")

# Add Yield = Production / Area
crop_data["Yield"] = crop_data["Production"] / crop_data["Area"]

# Drop unnecessary columns
data = crop_data.drop(["State_Name"], axis=1)

# ------------------------- CORRELATION ------------------------- #
numeric_data = data.select_dtypes(include=["number"])
corr_matrix = numeric_data.corr()
print("\nCorrelation matrix:\n", corr_matrix)

plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".3f")
plt.title("Correlation Matrix")
plt.show()

# ------------------------- ENCODING ------------------------- #
dummy = pd.get_dummies(data)
print("✅ One-hot encoding done. Shape:", dummy.shape)

# ------------------------- TRAIN-TEST SPLIT ------------------------- #
X = dummy.drop(["Production", "Yield"], axis=1)
y = dummy["Production"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)
print(f"Training set: {X_train.shape}, Test set: {X_test.shape}")

# ------------------------- MODEL TRAINING ------------------------- #
model = RandomForestRegressor(n_estimators=11, random_state=42)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# ------------------------- EVALUATION ------------------------- #
r2 = r2_score(y_test, y_pred)
adj_r2 = 1 - (1 - r2) * (len(y_test) - 1) / (len(y_test) - X_test.shape[1] - 1)

print("\n📊 Model Performance:")
print(f"R2 Score: {r2:.4f}")
print(f"Adjusted R2: {adj_r2:.4f}")

# ------------------------- VISUALIZATION ------------------------- #
plt.figure(figsize=(6, 5))
sns.kdeplot(y_test, color="r", label="Actual")
sns.kdeplot(y_pred, color="b", label="Predicted")
plt.title("Random Forest Regression — Actual vs Predicted")
plt.legend()
plt.show()

plt.figure(figsize=(6, 5))
plt.scatter(y_test, y_pred, alpha=0.7)
plt.xlabel("Actual")
plt.ylabel("Predicted")
plt.title("Random Forest Regression — Scatter Plot")
plt.show()

# ------------------------- SAVE MODEL ------------------------- #
joblib.dump(model, "CY.pkl")
joblib.dump(list(X.columns), "CY_features.pkl")

print("\n✅ Model and feature columns saved successfully!")
print("   → Model: CY.pkl")
print("   → Features: CY_features.pkl")
