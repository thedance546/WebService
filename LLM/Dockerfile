# Base 이미지 설정
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# Python 의존성 설치
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 복사
COPY . .

# Flask 앱 실행
CMD ["python", "llm_run_latest.py"]
