import requests

# 서버 URL 설정
url = "http://localhost:5001/ocr-detection"

# 테스트 이미지 경로
image_path = "testimage_receipt.jpg"

try:
    with open(image_path, "rb") as image_file:
        files = {"image": image_file}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"요청 실패! 상태 코드: {response.status_code}")
        print("응답 내용:", response.text)

except Exception as e:
    print("오류 발생:", str(e))