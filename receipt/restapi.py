import os
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
import re
import torch
import easyocr


import pathlib
if os.name == 'nt':  # Windows
    pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)

# YOLOv5 모델 로드
models = {
    "ocr_detection": torch.hub.load('ultralytics/yolov5', 'custom', path='best_ocr.pt', trust_repo=True, force_reload=True)
}


# EasyOCR 초기화
reader = easyocr.Reader(['ko', 'en'], gpu=False)

def extract_purchase_date(results):
    date_pattern = r'\b(\d{4}|\d{2})[-/\.]\d{2}[-/\.]\d{2}\b'
    for _, text, _ in results:
        match = re.search(date_pattern, text)
        if match:
            return match.group()
    return None

def filter_korean_text(texts):
    korean_texts = [text for text in texts if re.search(r'[가-힣]', text)]
    return korean_texts

def filter_text_by_yolo(yolo_results, ocr_results):
    filtered_texts = []
    for _, row in yolo_results.iterrows():
        box = [int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])]
        for result in ocr_results:
            bbox, text, _ = result
            if not isinstance(bbox, list) or len(bbox) != 4:
                continue
            text_x_min = min(bbox[0][0], bbox[1][0], bbox[2][0], bbox[3][0])
            text_y_min = min(bbox[0][1], bbox[1][1], bbox[2][1], bbox[3][1])
            text_x_max = max(bbox[0][0], bbox[1][0], bbox[2][0], bbox[3][0])
            text_y_max = max(bbox[0][1], bbox[1][1], bbox[2][1], bbox[3][1])

            if (
                text_x_min >= box[0] and text_x_max <= box[2] and
                text_y_min >= box[1] and text_y_max <= box[3]
            ):
                filtered_texts.append(text)

    return filter_korean_text(filtered_texts)


@app.route('/object-detection/<model_name>', methods=['POST'])
def object_detection(model_name):
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image = np.array(Image.open(BytesIO(image_file.read())).convert('RGB'))

    try:
        if model_name == "ocr_detection":
            ocr_results = reader.readtext(image)
            purchase_date = extract_purchase_date(ocr_results)

            model = models["ocr_detection"]
            yolo_results = model(image).pandas().xyxy[0]

            if yolo_results.empty:
                return jsonify({
                    "구매일자": purchase_date,
                    "품목": []
                })

            filtered_texts = filter_text_by_yolo(yolo_results, ocr_results)

            return jsonify({
                "구매일자": purchase_date,
                "품목": filtered_texts
            })



        else:
            return jsonify({"error": f"Model {model_name} not found"}), 404

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
