import os
import cv2
import numpy as np
from flask import Flask, request, jsonify, send_file
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import torch
import pathlib

if os.name == 'nt':  # Windows
    pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)

# YOLOv5 모델 로드
models = {
    "object_detection": torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt', trust_repo=True, force_reload=True)
}


def draw_bounding_boxes(image, results):
    """Draw bounding boxes on the image."""
    boxes = results.pandas().xyxy[0]

    # Confidence threshold 적용
    confidence_threshold = 0.3
    boxes = boxes[boxes['confidence'] >= confidence_threshold]

    pil_image = Image.fromarray(image)
    draw = ImageDraw.Draw(pil_image)

    # 클래스별 색상 설정
    class_colors = {
    '토마토': (255, 0, 0),              # 빨강
    '방울토마토': (0, 255, 0),          # 녹색
    '김치': (0, 0, 255),               # 파랑
    '가지': (255, 165, 0),             # 오렌지
    '오이': (128, 0, 128),             # 보라
    '애호박': (255, 255, 0),           # 노랑
    '팽이버섯': (0, 255, 255),         # 청록
    '새송이버섯': (75, 0, 130),        # 인디고
    '생 돼지고기': (139, 0, 0),        # 갈색
    '생 닭고기': (255, 20, 147),       # 핑크
    '생 소고기': (0, 128, 128),        # 어두운 청록
    '두부': (255, 215, 0),             # 금색
    '콩나물': (34, 139, 34),           # 진한 녹색
    '대파': (85, 107, 47),             # 올리브 녹색
    '양파': (220, 20, 60),             # 진한 빨강
    '마늘': (138, 43, 226),            # 보라색
    '시금치': (46, 139, 87),           # 짙은 녹색
    '고추': (173, 255, 47),             # 연두색
    '깻잎': (0, 128, 0),               # 어두운 녹색
    '당근': (255, 140, 0),             # 황토색
    '감자': (160, 82, 45),             # 갈색
    '고구마': (210, 105, 30),          # 진한 갈색
    '계란': (218, 165, 32),            # 금색
    '무': (105, 105, 105),             # 진한 회색
    '파프리카': (204, 204, 0),          # 어두운 빨강
    '게 맛살': (0, 191, 255),          # 하늘색
    '쌀': (192, 192, 192),             # 은색
    '어묵': (0, 0, 0),                 # 검정
    '사과': (128, 0, 0),               # 진한 빨강
    '비엔나소시지': (139, 69, 19)      # 초콜릿 갈색
}


    # 한글 폰트 경로 (시스템에 설치된 폰트를 지정해야 합니다)
    font_path = "gulim.ttc"  # Linux 예시
    font = ImageFont.truetype(font_path, 20)

    for _, row in boxes.iterrows():
        start_point = (int(row['xmin']), int(row['ymin']))
        end_point = (int(row['xmax']), int(row['ymax']))
        class_index = int(row['class'])  # 클래스 인덱스
        label = models["object_detection"].names[class_index]  # 클래스 이름 매핑
        confidence = row['confidence']

        # 색상 가져오기 (기본값: 흰색)
        color = class_colors.get(label, (255, 255, 255))

        draw.rectangle([start_point, end_point], outline=color, width=2)

        # Add label
        label_text = f"{label} ({confidence:.2f})"

        # 텍스트 크기 계산 (ImageFont 객체의 getbbox 메서드 사용)
        text_bbox = font.getbbox(label_text)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        text_position = (start_point[0], start_point[1] - text_height - 5)  # 텍스트 위치

        # 텍스트 배경 박스 그리기 (클래스별 색상)
        text_background = [
            (text_position[0] - 2, text_position[1] - 2),
            (text_position[0] + text_width + 2, text_position[1] + text_height + 2)
        ]
        draw.rectangle(text_background, fill=color)

        # 텍스트 색상 결정 (배경색의 밝기에 따라 변경)
        brightness = 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]  # 밝기 계산 (RGB 가중치)
        text_color = (0, 0, 0) if brightness > 128 else (255, 255, 255)  # 밝으면 검정, 어두우면 흰색

        # 텍스트 굵게: 여러 번 그려서 테두리 효과
        offsets = [(-1, -1), (-1, 1), (1, -1), (1, 1), (0, 0)]
        for offset in offsets:
            draw.text((text_position[0] + offset[0], text_position[1] + offset[1]),
                      label_text, fill=text_color, font=font)

    # Convert back to OpenCV format
    return np.array(pil_image)

@app.route('/object-detection/<model_name>', methods=['POST'])
def object_detection(model_name):
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image = np.array(Image.open(BytesIO(image_file.read())).convert('RGB'))

    try:
        if model_name == "object_detection":
            model = models["object_detection"]
            results = model(image)
            detections = results.pandas().xyxy[0]

             # Confidence threshold 추가
            confidence_threshold = 0.3  # 50% 신뢰도
            detections = detections[detections['confidence'] >= confidence_threshold]

            # 감지된 객체 수 계산
            name_counter = detections["name"].value_counts().to_dict()
            response = {name: f"{count}개" for name, count in name_counter.items()}

            return jsonify(response)
        else:
            return jsonify({"error": f"Model {model_name} not found"}), 404
    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route('/object-detection/<model_name>/image', methods=['POST'])
def object_detection_image(model_name):
    """객체 탐지 결과 이미지를 반환."""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image = np.array(Image.open(BytesIO(image_file.read())).convert('RGB'))

    try:
        if model_name == "object_detection":
            model = models["object_detection"]
            results = model(image)

            # 바운딩 박스가 그려진 이미지 생성
            result_image = draw_bounding_boxes(image.copy(), results)
            result_image_pil = Image.fromarray(result_image)

            # 디버그: 결과 이미지를 디스크에 저장
            debug_path = "/tmp/debug_output.jpg"
            result_image_pil.save(debug_path)
            print(f"[DEBUG] 결과 이미지가 {debug_path}에 저장되었습니다.")

            # 메모리 내에서 이미지 저장
            img_io = BytesIO()
            result_image_pil.save(img_io, format='JPEG')
            img_io.seek(0)

            # 디버그: 메모리 내 이미지 크기 확인
            print(f"[DEBUG] 메모리 내 이미지 크기: {len(img_io.getvalue())} bytes")

            return send_file(img_io, mimetype='image/jpeg')
        else:
            return jsonify({"error": f"Model {model_name} not found"}), 404
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)