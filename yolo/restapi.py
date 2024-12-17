# YOLOv5 🚀 by Ultralytics, GPL-3.0 license
"""
Run a Flask REST API exposing one or more YOLOv5s models
"""
import os
import argparse
import io
from collections import Counter

import torch
from flask import Flask, request, jsonify
from PIL import Image

import pathlib
if os.name == 'nt':  # Windows
    pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)
models = {}

# Flask 엔드포인트 URL
DETECTION_URL = "/v1/object-detection/image_team6/<model_name>"

@app.route(DETECTION_URL, methods=["POST"])
def predict(model_name):
    try:
        print(f"Received request for model: {model_name}")

        if request.method != "POST":
            return "Invalid method", 405

        if not request.files.get("image"):
            print("No image provided in request.")
            return "No image provided", 400

        # 이미지 읽기
        im_file = request.files["image"]
        print(f"Image file received: {im_file.filename}")
        im_bytes = im_file.read()
        im = Image.open(io.BytesIO(im_bytes))

        if model_name in models:
            # 모델 추론
            results = models[model_name](im, size=640)
            detections = results.pandas().xyxy[0].to_dict(orient="records")

            # 물체 이름으로 개수 세기
            name_counter = Counter([item["name"] for item in detections])

            # 응답 데이터 구성
            response = {name: f"{count}개" for name, count in name_counter.items()}
            print("Detection response:", response)

            return jsonify(response)

        print("Model not found:", model_name)
        return f"Model {model_name} not found", 404

    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Flask API exposing YOLOv5 model")
    parser.add_argument("--port", default=5000, type=int, help="port number")
    parser.add_argument('--model', nargs='+', default=['yolov5s'], help='model(s) to run, i.e. --model yolov5n yolov5s')
    opt = parser.parse_args()

    # 모델 로드
    for m in opt.model:
        models[m] = torch.hub.load("ultralytics/yolov5", 'custom', 'best.pt', force_reload=True, skip_validation=True)

        # 클래스 이름 수정
        models[m].names = [
            '토마토','방울토마토','김치','가지','오이','애호박','팽이버섯','새송이버섯','생 돼지고기','생 닭고기','생 소고기','두부','콩나물','대파','양파','마늘','시금치','고추','깻잎','당근','감자','고구마','계란','무','파프리카','게맛살','쌀','어묵','사과','비엔나소시지'  # 수정된 클래스 이름
        ]

    # Flask 서버 실행
    app.run(host="0.0.0.0", port=opt.port, debug=True)
