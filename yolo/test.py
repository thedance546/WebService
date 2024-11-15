import requests
from collections import Counter
import json

# 이미지 파일 경로
image_path = 'C:/projects/project/yolo/test14.jpg'

# 파일 전송
with open(image_path, 'rb') as f:
    response = requests.post('http://localhost:5000/detect', files={'image': f})

# 응답 확인 및 JSON 파일로 저장
if response.status_code == 200:
    detections = response.json().get('detections', [])
    
    # 객체 이름을 추출하여 개수를 계산
    item_counts = Counter([detection['name'] for detection in detections])
    
    # 클래스 이름과 개수만 포함된 JSON 형식 생성
    simplified_detections = [{"name": item, "count": count} for item, count in item_counts.items()]
    
    # JSON 파일로 저장
    with open("detection_results_simplified.json", "w", encoding="utf-8") as json_file:
        json.dump(simplified_detections, json_file, ensure_ascii=False, indent=4)

    # 요약된 결과 출력
    for item, count in item_counts.items():
        print(f"{item}: {count}개")
else:
    print(f"Error: 서버 응답 오류 - 상태 코드: {response.status_code}")
    print("응답 내용:", response.text)