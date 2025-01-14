import os
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import cv2
import torch
import pytesseract
import re

import pathlib
if os.name == 'nt':  # Windows
    pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)

# YOLO 모델 로드
model = torch.hub.load('ultralytics/yolov5', 'custom', path='best_ocr.pt', trust_repo=True, force_reload=True)

# Tesseract 환경 변수 설정
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

def detect_text_with_yolo(image_path, confidence_threshold=0.35):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"이미지를 로드할 수 없습니다: {image_path}")

    results = model(img)
    yolo_boxes = results.pandas().xyxy[0]
    boxes = []
    for _, row in yolo_boxes.iterrows():
        if row['confidence'] >= confidence_threshold:
            boxes.append([int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])])
    return img, boxes

def preprocess(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    stretched = cv2.normalize(gray, None, 30, 150, cv2.NORM_MINMAX)
    denoised = cv2.fastNlMeansDenoising(stretched, None, 6, 8, 17)
    binary = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 7, 3
    )
    return binary

def extract_text_with_tesseract(img, lang="kor"):
    return pytesseract.image_to_string(img, lang=lang)

def extract_purchase_date(text):
    """텍스트에서 날짜 추출."""
    date_pattern = r'\b(\d{4}|\d{2})[-/\.]\d{2}[-/\.]\d{2}\b'
    match = re.search(date_pattern, text)
    return match.group() if match else None

def clean_text(text):
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        if any(char.isalpha() for char in line):
            cleaned_lines.append(line)
    return cleaned_lines

@app.route('/ocr-detection', methods=['POST'])
def ocr_detection():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    try:
        image_file = request.files['image']
        image_path = "testimage_receipt13.jpg"
        image_file.save(image_path)

        img, boxes = detect_text_with_yolo(image_path)
        recognized_texts = []
        for x1, y1, x2, y2 in boxes:
            cropped = img[y1:y2, x1:x2]
            processed = preprocess(cropped)
            text = extract_text_with_tesseract(processed, lang="kor")
            recognized_texts.extend(clean_text(text))

        full_text = extract_text_with_tesseract(img, lang="kor")
        purchase_date = extract_purchase_date(full_text)

        return jsonify({
            "구매일자": purchase_date,
            "품목": recognized_texts
        })

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

