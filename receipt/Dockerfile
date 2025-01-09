# Use Python 3.9 slim image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy necessary files
COPY requirements.txt requirements.txt
COPY restapi.py restapi.py
COPY ./best_ocr.pt /app/best_ocr.pt
COPY ./test.py /app/test.py

# Update and install necessary system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    libjpeg62-turbo \
    libpng16-16 \
    libsm6 \
    libxext6 \
    libxrender1 \
    tesseract-ocr \
    tesseract-ocr-kor \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Download Tesseract Korean language data
RUN mkdir -p /usr/share/tesseract-ocr/4.00/tessdata && \
    wget -O /usr/share/tesseract-ocr/4.00/tessdata/kor.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/kor.traineddata

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Set Tesseract environment variable
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Expose Flask application port
EXPOSE 5001

# Run the Flask app
CMD ["python", "restapi.py"]
