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
    '고추': (255, 99, 71),             # 산호색
    '깻잎': (0, 128, 0),               # 어두운 녹색
    '당근': (255, 140, 0),             # 황토색
    '감자': (160, 82, 45),             # 갈색
    '고구마': (210, 105, 30),          # 진한 갈색
    '계란': (218, 165, 32),            # 금색
    '무': (105, 105, 105),             # 진한 회색
    '파프리카': (255, 69, 0),          # 밝은 빨강
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
        text_position = (start_point[0], start_point[1] - 20)  # 텍스트 위치

        # 텍스트 굵게: 여러 번 그려서 테두리 효과
        offsets = [(-1, -1), (-1, 1), (1, -1), (1, 1), (0, 0)]
        for offset in offsets:
            draw.text((text_position[0] + offset[0], text_position[1] + offset[1]),
                      label_text, fill=color, font=font)


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

            result_image = draw_bounding_boxes(image.copy(), results)
            result_image_path = "output_yolo_results.jpg"
            cv2.imwrite(result_image_path, cv2.cvtColor(result_image, cv2.COLOR_RGB2BGR))

            name_counter = detections["name"].value_counts().to_dict()
            response = {name: f"{count}개" for name, count in name_counter.items()}

            return jsonify(
                response,
            )

        else:
            return jsonify({"error": f"Model {model_name} not found"}), 404

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
