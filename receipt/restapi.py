import os
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
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

def resize_image(img, target_width=1024, target_height=768):
    """이미지 크기를 조정."""
    return cv2.resize(img, (target_width, target_height), interpolation=cv2.INTER_AREA)

def crop_and_scale(img, box, scale=2.0):
    """박스 영역을 잘라내고 스케일 조정."""
    x1, y1, x2, y2 = box
    cropped = img[y1:y2, x1:x2]
    height, width = cropped.shape[:2]
    return cv2.resize(cropped, (int(width * scale), int(height * scale)), interpolation=cv2.INTER_LINEAR)

def detect_text_with_yolo(image, confidence_threshold=0.3):
    """YOLO를 사용하여 텍스트 영역 감지."""
    results = model(image)
    yolo_boxes = results.pandas().xyxy[0]
    boxes = []

    for _, row in yolo_boxes.iterrows():
        conf = row['confidence']
        if conf >= confidence_threshold:
            boxes.append([int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])])

    return boxes

def preprocess(img):
    """이미지를 전처리하여 OCR 성능을 향상."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    stretched = cv2.normalize(gray, None, 30, 150, cv2.NORM_MINMAX)
    denoised = cv2.fastNlMeansDenoising(stretched, None, 6, 8, 17)
    binary = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 7, 3
    )
    return binary

def extract_text_with_tesseract(img, lang="kor"):
    """Tesseract OCR로 텍스트 추출."""
    return pytesseract.image_to_string(img, lang=lang)

def extract_purchase_date(text):
    """텍스트에서 날짜 추출."""
    date_pattern = r'\b(\d{4}|\d{2})[-/\.]\d{2}[-/\.]\d{2}\b'
    match = re.search(date_pattern, text)
    return match.group() if match else None

def clean_text(text):
    """
    한글, 영어, 숫자, 공백, 괄호를 포함하며, 한글/영어 사이에 있는 숫자만 유지.
    """
    lines = text.split('\n')
    cleaned_lines = []

    # 제외할 단어 목록
    excluded_words = ["포 묘모스 로 그매스프 도"]

    for line in lines:
        # 한글/영어가 포함된 텍스트만 유지
        if any(char.isalpha() for char in line):
            # 허용된 문자(한글, 영어, 숫자, 괄호, 공백)만 유지
            cleaned_line = re.sub(r'[^가-힣a-zA-Z0-9\s\(\)]', '', line)
            cleaned_line = re.sub(r'\s+', ' ', cleaned_line).strip()

            # 제외할 단어가 포함된 경우, 해당 단어 제거
            for word in excluded_words:
                cleaned_line = cleaned_line.replace(word, "")

            # 한글/영어 사이에 없는 숫자는 제거
            if any(char.isdigit() for char in cleaned_line):
                cleaned_line = re.sub(r'(?<![가-힣a-zA-Z])\d+|\d+(?![가-힣a-zA-Z])', '', cleaned_line).strip()

            if cleaned_line:  # 비어 있지 않은 경우만 추가
                cleaned_lines.append(cleaned_line)

    return cleaned_lines


@app.route('/ocr-detection', methods=['POST'])
def ocr_detection():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image = np.array(Image.open(BytesIO(image_file.read())).convert('RGB'))

    try:
        # 이미지 크기 조정
        resized_image = resize_image(image)

        # YOLO로 텍스트 영역 감지
        boxes = detect_text_with_yolo(resized_image)

        recognized_texts = []
        for (x1, y1, x2, y2) in boxes:
            cropped = crop_and_scale(resized_image, (x1, y1, x2, y2), scale=1.5)
            processed = preprocess(cropped)
            text = extract_text_with_tesseract(processed, lang="kor")
            recognized_texts.extend(clean_text(text))

        # 전체 이미지 텍스트와 구매일자 추출
        full_text = extract_text_with_tesseract(resized_image, lang="kor")
        purchase_date = extract_purchase_date(full_text)

        return jsonify({
            "구매일자": purchase_date,
            "품목": recognized_texts
        })

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
