import os  # 추가
from flask import Flask, request, jsonify
import json
import onnxruntime as ort
import numpy as np
import cv2
from collections import Counter

app = Flask(__name__)

# 업로드 폴더 설정
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ONNX 모델 로드
MODEL_PATH = "best.onnx"
session = ort.InferenceSession(MODEL_PATH)

# 클래스 이름 정의
CLASS_NAMES = ['토마토', '방울토마토', '김치', '가지', '오이', '애호박', '팽이버섯', '새송이버섯',
               '생 돼지고기', '생 닭고기', '생 소고기', '두부', '콩나물', '대파', '양파', '마늘', 
               '시금치', '고추', '깻잎', '당근', '감자', '고구마', '계란', '무', '파프리카', 
               '게맛살', '쌀', '어묵', '사과', '비엔나소시지']

# 이미지 전처리 함수
def preprocess_image(image_path):
    image = cv2.imread(image_path)  # BGR로 읽기
    image = cv2.resize(image, (640, 640))
    image_np = np.array(image).transpose(2, 0, 1) / 255.0  # 정규화
    return np.expand_dims(image_np, axis=0).astype(np.float32)

# Non-Maximum Suppression 함수
def non_max_suppression(predictions, conf_threshold=0.3, iou_threshold=0.45):
    boxes = predictions[:, :4]
    scores = predictions[:, 4]
    classes = np.argmax(predictions[:, 5:], axis=1)
    valid_idx = scores > conf_threshold

    boxes, scores, classes = boxes[valid_idx], scores[valid_idx], classes[valid_idx]
    indices = cv2.dnn.NMSBoxes(
        boxes.tolist(),
        scores.tolist(),
        conf_threshold,
        iou_threshold
    )
    if len(indices) > 0:
        indices = indices.flatten()
        boxes = boxes[indices]
        scores = scores[indices]
        classes = classes[indices]
    return boxes, scores, classes

@app.route('/detect', methods=['POST'])
def detect_objects():
    try:
        # 이미지 파일 확인
        if 'image' not in request.files:
            return jsonify({"error": "No image file in request"}), 400

        # 이미지 저장
        image_file = request.files['image']
        image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
        image_file.save(image_path)

        # 이미지 전처리
        input_tensor = preprocess_image(image_path)

        # ONNX 모델 추론
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        outputs = session.run([output_name], {input_name: input_tensor})

        # Non-Maximum Suppression 적용
        predictions = outputs[0]
        boxes, scores, classes = non_max_suppression(predictions[0], conf_threshold=0.3)

        # 클래스 이름 추출
        detected_classes = [CLASS_NAMES[class_id] for class_id in classes]

        # 클래스 이름과 개수 계산
        class_counts = Counter(detected_classes)

        # JSON 응답 생성 (ensure_ascii=False로 설정)
        return json.dumps({"detections": class_counts}, ensure_ascii=False), 200, {'Content-Type': 'application/json; charset=utf-8'}

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

