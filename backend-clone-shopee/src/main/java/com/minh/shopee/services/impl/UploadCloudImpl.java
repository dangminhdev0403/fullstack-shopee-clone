package com.minh.shopee.services.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.minh.shopee.services.utils.files.UploadCloud;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "UploadCloud")
public class UploadCloudImpl implements UploadCloud {

    private final Cloudinary cloudinary;

    @Override
    public String handleSaveUploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            log.error("File is empty");
            throw new IOException("File is empty");
        }
        log.info("Uploading file:" + file.getOriginalFilename() + " to Cloudinary infolder {}" + folder);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", folder));

        log.info("File uploaded successfully to Cloudinary: {}", uploadResult.get("secure_url"));
        return uploadResult.get("secure_url").toString();
    }

    @Override
    public String extractPublicId(String url) {
        log.info("Extracting public ID from URL: {}", url);

        String[] parts = url.split("/upload/");
        if (parts.length < 2) {
            log.warn("Invalid URL: '/upload/' not found");
            return null;
        }

        String path = parts[1];
        log.debug("Path after '/upload/': {}", path);

        int slashIndex = path.indexOf("/");
        if (slashIndex == -1) {
            log.warn("No slash found after version segment");
            return null;
        }

        String filePath = path.substring(slashIndex + 1);
        log.debug("Extracted file path (folder + filename): {}", filePath);

        int dotIndex = filePath.lastIndexOf(".");
        if (dotIndex != -1) {
            filePath = filePath.substring(0, dotIndex);
            log.debug("File path after removing extension: {}", filePath);
        }

        log.info("Final public ID: {}", filePath);
        return filePath;
    }

    @Override
    public void deleteFile(String fileUrl) throws IOException {

        String publicId = this.extractPublicId(fileUrl);
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("File with public ID {} deleted successfully", publicId);

    }

}
