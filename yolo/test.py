import requests

# 이미지 파일 경로
image_path = "C:/projects/project/yolo/camera2.jpg"

# Flask API URL
url = "http://localhost:5000/detect"

# 파일 업로드
with open(image_path, 'rb') as image:
    response = requests.post(url, files={'image': image})

# 결과 출력
if response.status_code == 200:
    print("Detected classes and counts:")
    detections = response.json().get("detections", {})
    for class_name, count in detections.items():
        print(f"{class_name}: {count}개")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
