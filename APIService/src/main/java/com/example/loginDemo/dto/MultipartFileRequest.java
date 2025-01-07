package com.example.loginDemo.dto;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class MultipartFileRequest extends HttpEntity<byte[]> {

    public MultipartFileRequest(byte[] imageBytes) throws IOException {
        super(imageBytes, createHeaders());
    }

    private static HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        return headers;
    }
}
