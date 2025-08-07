package com.minh.shopee.services.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.services.utils.files.UploadServer;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j(topic = "UploadServer")
public class UploadServerImpl implements UploadServer {

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Override
    public String handleSaveUploadFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            log.warn("Uploaded file is empty.");
            return null;
        }

        try {
            log.info("Starting to save file to folder: {}", folder);
            Path uploadPath = Paths.get(uploadDir, folder).toAbsolutePath().normalize();
            log.info("Upload directory path: {}", uploadPath);

            if (!Files.exists(uploadPath)) {
                log.info("Directory does not exist, creating: {}", uploadPath);
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String sanitizedFileName = originalFileName == null ? ""
                    : originalFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            log.info("Original filename: {}, sanitized filename: {}", originalFileName, sanitizedFileName);

            String uniqueFileName = System.currentTimeMillis() + "-" + sanitizedFileName;
            log.info("Unique filename: {}", uniqueFileName);

            Path targetLocation = uploadPath.resolve(uniqueFileName);
            log.info("File save path: {}", targetLocation);
            file.transferTo(targetLocation.toFile());

            String fullFileUrl = uploadPath.toUri().toString() + folder + "/" + uniqueFileName;
            log.info("File saved with URL: {}", fullFileUrl);

            return fullFileUrl;
        } catch (IOException e) {
            log.error("Error saving file: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public boolean handleDeleteFile(String fileName, String folder) {
        if (fileName == null || fileName.isEmpty()) {
            log.warn("Filename is empty or null.");
            return false;
        }

        try {
            log.info("Starting to delete file: {} in folder: {}", fileName, folder);
            Path uploadPath = Paths.get(uploadDir, folder).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(fileName);
            log.info("Path of file to delete: {}", filePath);

            File file = filePath.toFile();
            if (file.exists()) {
                log.info("File exists, proceeding to delete: {}", filePath);
                return deleteFile(filePath);
            } else {
                log.warn("File does not exist: {}", filePath);
                return false;
            }
        } catch (Exception e) {
            log.error("Error deleting file {} in folder {}: {}", fileName, folder, e.getMessage(), e);
            return false;
        }
    }

    private boolean deleteFile(Path filePath) {
        try {
            log.info("Performing file deletion: {}", filePath);
            Files.delete(filePath);
            log.info("File deleted successfully: {}", filePath);
            return true;
        } catch (IOException ex) {
            log.error("Unable to delete file {}: {}", filePath, ex.getMessage(), ex);
            return false;
        }
    }

    @Override
    public boolean deleteAllFiles(String folder) {
        try {
            log.info("Starting to delete all contents in folder: {}", folder);
            Path folderPath = Paths.get(uploadDir, folder).toAbsolutePath().normalize();
            log.info("Path of folder to delete: {}", folderPath);

            if (!Files.exists(folderPath)) {
                log.warn("Folder does not exist: {}", folderPath);
                return false;
            }

            log.info("Traversing and deleting all files/subfolders in: {}", folderPath);
            try (Stream<Path> paths = Files.walk(folderPath)) {
                paths.sorted((p1, p2) -> -p1.compareTo(p2))
                        .forEach(path -> {
                            try {
                                log.info("Performing deletion: {}", path);
                                Files.delete(path);
                                log.info("Deleted successfully: {}", path);
                            } catch (IOException e) {
                                log.error("Unable to delete: {}: {}", path, e.getMessage(), e);
                            }
                        });
            }

            log.info("Deleted entire folder and its contents: {}", folderPath);
            return true;
        } catch (IOException e) {
            log.error("Error deleting folder {}: {}", folder, e.getMessage(), e);
            return false;
        }
    }
}