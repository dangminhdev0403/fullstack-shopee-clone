package com.minh.shopee.services.utils.files;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface UploadCloud {
    String handleSaveUploadFile(MultipartFile file, String folder) throws IOException;

    public String extractPublicId(String url);

    public void deleteFile(String fileUrl) throws IOException;
}
