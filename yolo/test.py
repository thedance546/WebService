import requests

# Flask 서버 URL (모델 이름 포함)
model_name = "yolov5s"  # 사용할 모델 이름
url = f"http://localhost:5000/v1/object-detection/image_team6/{model_name}"

# 전송할 이미지 파일 경로
image_path = "/app/testimage.jpg"

# 이미지 파일을 POST 요청으로 전송
with open(image_path, "rb") as image_file:
    files = {"image": image_file}
    response = requests.post(url, files=files)

# 응답 출력
if response.status_code == 200:
    print("Response JSON:", response.json())
else:
    print(f"Failed to connect, Status Code: {response.status_code}")
