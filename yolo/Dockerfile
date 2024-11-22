FROM python:3.9-slim

WORKDIR /app

# 필요한 Python 패키지만 설치
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 필요한 파일만 복사
COPY restapi.py /app/
COPY best.onnx /app/

# 최소한의 시스템 라이브러리 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libsm6 libxext6 libxrender-dev libgl1 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 5000
CMD ["python", "restapi.py"]

