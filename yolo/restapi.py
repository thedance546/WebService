from flask import Flask, request, jsonify
import torch
from PIL import Image
import os
import sys
from torchvision import transforms as T
from models.common import DetectMultiBackend  # YOLOv5 모델 로드 클래스
from utils.general import non_max_suppression, scale_boxes
import pandas as pd


import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

# YOLOv5 코드 경로 설정
sys.path.append('C:/projects/project/yolo')  # YOLOv5 코드가 있는 경로 추가

# Flask 애플리케이션 초기화
app = Flask(__name__)

# YOLOv5 모델 로드 (로컬 경로에서 불러오기)
MODEL_PATH = "best.pt"  # 로컬 모델 파일 경로
device = torch.device('cpu')  # CPU 설정
model = DetectMultiBackend(MODEL_PATH, device=device)  # DetectMultiBackend로 모델 로드
model.eval()  # 평가 모드 설정

# 이미지 전처리를 위한 변환 설정
transform = T.Compose([
    T.Resize((640, 640)),  # YOLOv5 입력 크기로 조정
    T.ToTensor()           # 텐서로 변환
])

# 이미지 업로드 경로 설정
UPLOAD_FOLDER = 'static'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/detect', methods=['POST'])
def detect_objects():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file in request"}), 400

        # 이미지 파일 가져오기
        image_file = request.files['image']
        image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
        image_file.save(image_path)

        # 이미지 열기 및 텐서로 변환 후 객체 탐지 수행
        image = Image.open(image_path).convert("RGB")
        original_size = image.size  # 원본 이미지 크기 저장 (width, height)
        image = transform(image).unsqueeze(0)  # 배치 차원 추가
        predictions = model(image)

        # 비최대 억제 및 결과 처리
        predictions = non_max_suppression(predictions)[0]
        if predictions is None:
            return jsonify({"detections": []})

        # 원본 이미지 크기로 스케일 복원
        predictions[:, :4] = scale_boxes(image.shape[2:], predictions[:, :4], original_size)
        
        # 결과를 pandas 형식으로 변환
        df = pd.DataFrame(predictions.cpu().numpy(), columns=['xmin', 'ymin', 'xmax', 'ymax', 'confidence', 'class'])
        df['name'] = df['class'].apply(lambda x: model.names[int(x)])

        # JSON 형식으로 변환하여 응답
        response = {"detections": df.to_dict(orient="records")}
        os.remove(image_path)
        
        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {e}")  # 서버 콘솔에 오류 메시지 출력
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

# Flask 서버 실행
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)