from flask import Flask, jsonify
import subprocess
import os, sys

app = Flask(__name__)

@app.route("/start-backend", methods=["POST"])
def start_backend():
    try:
        python_exe = sys.executable  # Get current Python path (your venv)
        subprocess.Popen([python_exe, "app.py"], cwd=os.getcwd())
        return jsonify({"message": "Backend started successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
