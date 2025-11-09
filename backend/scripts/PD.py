# ------------------------------------------------------------
# Plant Disease Detection (PD.py) — Train from Scratch
# ------------------------------------------------------------
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import matplotlib.pyplot as plt
import joblib

# ---------------------- GPU CONFIG ---------------------- #
def configure_gpu():
    try:
        gpus = tf.config.list_physical_devices('GPU')
        if gpus:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            print("✅ GPU memory growth enabled.")
        else:
            print("⚠️ No GPU found, using CPU.")
    except Exception as e:
        print(f"GPU config error: {e}")

# ---------------------- PATHS ---------------------- #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "../data/PlantVillage")
MODEL_PATH = os.path.join(BASE_DIR, "../models/PD_model.h5")
CLASSES_PATH = os.path.join(BASE_DIR, "../models/PD_classes.pkl")

# ---------------------- PARAMETERS ---------------------- #
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 25
LR = 1e-4

# ---------------------- LOAD & PREPARE DATA ---------------------- #
def load_and_prepare_data():
    if not os.path.exists(DATA_DIR):
        raise FileNotFoundError(f"❌ Dataset not found at {DATA_DIR}")

    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.25),
        layers.RandomZoom(0.25),
        layers.RandomBrightness(0.2),
        layers.RandomContrast(0.2)
    ])

    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE
    )

    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE
    )

    class_names = train_ds.class_names
    print(f"✅ Found {len(class_names)} classes.")

    os.makedirs(os.path.dirname(CLASSES_PATH), exist_ok=True)
    joblib.dump(class_names, CLASSES_PATH)
    print(f"💾 Class names saved to {CLASSES_PATH}")

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y),
                            num_parallel_calls=AUTOTUNE)
    train_ds = train_ds.cache().shuffle(1000).prefetch(AUTOTUNE)
    val_ds = val_ds.cache().prefetch(AUTOTUNE)

    return train_ds, val_ds, class_names

# ---------------------- MODEL (Custom CNN) ---------------------- #
def create_model(num_classes):
    model = models.Sequential([
        layers.Rescaling(1./255, input_shape=(IMG_SIZE, IMG_SIZE, 3)),

        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.3),

        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.3),

        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.4),

        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LR),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.SparseTopKCategoricalAccuracy(k=3, name='top3_acc')]
    )

    return model

# ---------------------- TRAINING ---------------------- #
def train_model():
    configure_gpu()
    train_ds, val_ds, class_names = load_and_prepare_data()
    num_classes = len(class_names)

    model = create_model(num_classes)
    model.summary()

    callbacks = [
        EarlyStopping(monitor='val_accuracy', patience=4, restore_best_weights=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.3, patience=2, min_lr=1e-6),
        ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_accuracy', mode='max')
    ]

    print("\n🚀 Training started...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)
    print(f"\n✅ Model saved as {MODEL_PATH}")

    plot_training(history)
    return model, class_names

# ---------------------- PLOT TRAINING ---------------------- #
def plot_training(history):
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']

    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(acc, label='Train Accuracy')
    plt.plot(val_acc, label='Val Accuracy')
    plt.legend()
    plt.title('Accuracy')

    plt.subplot(1, 2, 2)
    plt.plot(loss, label='Train Loss')
    plt.plot(val_loss, label='Val Loss')
    plt.legend()
    plt.title('Loss')

    plt.tight_layout()
    plt.savefig(os.path.join(BASE_DIR, "../models/PD_training_plot.png"))
    plt.show()

# ---------------------- MAIN ---------------------- #
if __name__ == "__main__":
    train_model()
