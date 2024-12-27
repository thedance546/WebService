package com.example.loginDemo.image;

import io.micrometer.common.lang.Nullable;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public class MultipartInputStreamFileResource extends InputStreamResource {
    private final String filename;

    public MultipartInputStreamFileResource(MultipartFile file) throws IOException {
        super(file.getInputStream());  // MultipartFile에서 InputStream을 가져옵니다.
        this.filename = file.getOriginalFilename();  // 파일 이름을 저장합니다.
    }

    @Override
    public String getFilename() {
        return this.filename;
    }

    @Override
    public long contentLength() {
        try {
            return super.contentLength();  // InputStream의 contentLength를 반환합니다.
        } catch (IOException e) {
            return -1;  // contentLength를 구할 수 없으면 -1을 반환
        }
    }
}
