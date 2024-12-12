import os
from flask import Flask, request, jsonify
import torch
from PIL import Image
from utils.general import non_max_suppression
from torchvision.transforms import functional as F
import json

app = Flask(__name__)

import pathlib
if os.name == 'nt':  # Windows
    pathlib.PosixPath = pathlib.WindowsPath
    
# JSON 저장 경로
JSON_SAVE_PATH = 'detection_results_simplified.json'

# 업로드 폴더 설정
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# PyTorch 모델 로드
from models.common import DetectMultiBackend

MODEL_PATH = "best.pt"
device = torch.device("cpu")
model = DetectMultiBackend(MODEL_PATH, device=device)  # DetectMultiBackend 사용
model.eval()  # 평가 모드 설정

# 클래스 이름 정의
CLASS_NAMES = ['토마토', '방울토마토', '김치', '가지', '오이', '애호박', '팽이버섯', '새송이버섯',
               '생 돼지고기', '생 닭고기', '생 소고기', '두부', '콩나물', '대파', '양파', '마늘', 
               '시금치', '고추', '깻잎', '당근', '감자', '고구마', '계란', '무', '파프리카', 
               '게맛살', '쌀', '어묵', '사과', '비엔나소시지']

# 이미지 전처리 함수
def preprocess_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = F.resize(image, [640, 640])  # 모델 입력 크기로 조정
    image = F.to_tensor(image).unsqueeze(0)  # 텐서로 변환 후 배치 차원 추가
    return image

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

        # PyTorch 모델 추론
        with torch.no_grad():
            predictions = model(input_tensor.to(device))  # 모델 추론

        # Non-Maximum Suppression 적용
        predictions = non_max_suppression(predictions, conf_thres=0.3, iou_thres=0.4)[0]

        if predictions is None:
            return jsonify({"detections": []})

        # 클래스 이름과 개수 계산
        detected_classes = [CLASS_NAMES[int(cls)] for cls in predictions[:, -1].cpu().numpy()]
        class_counts = {cls: detected_classes.count(cls) for cls in set(detected_classes)}

        # JSON 파일로 저장
        with open(JSON_SAVE_PATH, "w", encoding="utf-8") as json_file:
            json.dump({"detections": class_counts}, json_file, ensure_ascii=False, indent=4)

        # 결과 반환
        return jsonify({"detections": class_counts})

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)