import requests

# Flask 서버 URL 설정
ingredient_model_name = "object_detection"  # 식재료 인식 모델 이름

# 영수증 영역 추출 URL
ingredient_url = f"http://localhost:5000/object-detection/{ingredient_model_name}"

# 다운로드 URL
download_url = "http://localhost:5000/download/"

# 테스트할 이미지 경로
ingredient_image_path = "/app/testimage_ingredient.jpg"


# 2. 식재료 인식
try:
    with open(ingredient_image_path, "rb") as ingredient_image_file:
        ingredient_files = {"image": ingredient_image_file}
        ingredient_response = requests.post(ingredient_url, files=ingredient_files)

    if ingredient_response.status_code == 200:
        ingredient_data = ingredient_response.json()
        print(ingredient_data)


    else:
        print(f"식재료 인식 실패! 상태 코드: {ingredient_response.status_code}")
        print("응답 내용:", ingredient_response.text)
        exit(1)

except Exception as e:
    print("식재료 인식 중 오류 발생:", str(e))
    exit(1)