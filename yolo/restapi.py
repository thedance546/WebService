# restapi.py
import argparse
import io
import sys
from pathlib import Path

import torch
from flask import Flask, request
from PIL import Image

import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

# YOLOv5 경로 설정 (yolov5 코드가 있는 경로로 수정)
sys.path.append("C:\\WorkSpace\\yolo")  # YOLOv5 폴더의 정확한 경로를 여기에 설정

from models.common import DetectMultiBackend
from utils.torch_utils import select_device

app = Flask(__name__)
models = {}

DETECTION_URL = "/v1/object-detection/<model>"

@app.route(DETECTION_URL, methods=["POST"])
def predict(model):
    if request.files.get("image"):
        im_file = request.files["image"]
        im_bytes = im_file.read()
        im = Image.open(io.BytesIO(im_bytes))

        if model in models:
            results = models[model](im, size=640)
            object_names = results.pandas().xyxy[0]['name'].tolist()
            return {"detected_objects": object_names}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Flask API exposing YOLOv5 model")
    
    # 여기에 best.pt 파일의 경로를 지정합니다.
    parser.add_argument("--model", nargs="+", default=["C:/WorkSpace/yolo/best.pt"], help="model path(s)")  # best.pt 파일의 경로로 수정
    parser.add_argument("--port", default=5000, type=int, help="port number")
    
    opt = parser.parse_args()

    device = select_device("cpu")

    for m in opt.model:
        print(f"Loading model from path: {m}")
        models[m] = DetectMultiBackend(m, device=device)

    app.run(host="0.0.0.0", port=opt.port)
