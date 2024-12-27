import requests

# Flask 서버 URL 설정
receipt_model_name = "ocr_detection"  # 영수증 영역 추출 모델 이름

# 영수증 영역 추출 URL
receipt_url = f"http://localhost:5001/object-detection/{receipt_model_name}"

# 다운로드 URL
download_url = "http://localhost:5001/download/"

# 테스트할 이미지 경로
receipt_image_path = "/app/testimage_receipt.jpg"


# 1. 영수증 영역 추출
try:
    with open(receipt_image_path, "rb") as receipt_image_file:
        receipt_files = {"image": receipt_image_file}
        receipt_response = requests.post(receipt_url, files=receipt_files)

    if receipt_response.status_code == 200:
        receipt_data = receipt_response.json()
        print("\n[영수증 추출 결과]")
        print(receipt_data)

    else:
        print(f"영수증 추출 실패! 상태 코드: {receipt_response.status_code}")
        print("응답 내용:", receipt_response.text)
        exit(1)

except Exception as e:
    print("영수증 영역 추출 중 오류 발생:", str(e))
    exit(1)
