# Python 3.9 slim 버전 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY requirements.txt requirements.txt
COPY restapi.py restapi.py
COPY ./best_ocr.pt /app/best_ocr.pt
COPY ./test.py /app/test.py

# pip 업그레이드 및 의존성 설치
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cu121

# 필요한 시스템 패키지 설치 및 정리
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    libjpeg62-turbo \
    libpng16-16 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Flask 실행 포트 설정
EXPOSE 5001

# Flask 서버 실행
CMD ["python", "restapi.py"]
