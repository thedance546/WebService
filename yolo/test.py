import requests

# 이미지 파일 경로
image_path = '/app/testimage.jpg'

# 파일 전송
with open(image_path, 'rb') as f:
    response = requests.post('http://localhost:5000/detect', files={'image': f})

# 서버 응답 출력
if response.status_code == 200:
    print(f"{response.json()}")  # 서버에서 반환된 JSON 데이터 출력
else:
    print(f"Error: 서버 응답 오류 - 상태 코드: {response.status_code}")
    print("응답 내용:", response.text)