# Python 3.12-slim 이미지를 사용
FROM python:3.12-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY requirements.txt requirements.txt
COPY api_test2.py api_test2.py
COPY pj.env pj.env

# Python 패키지 설치
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt



# 환경 변수 설정
ENV PYTHONUNBUFFERED=1

# 컨테이너에서 사용할 포트 노출
EXPOSE 5000

# Flask 서버 실행
CMD ["python", "api_test2.py"]
