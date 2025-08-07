package com.minh.shopee.services.utils.files;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.model.Category;
import com.minh.shopee.services.utils.files.data.ProductData;

public interface ExcelHelper {
    void isExcelFile(MultipartFile file);

    List<Category> readExcelCategoryFile(MultipartFile file) throws IOException;

    ProductData readExcelProductFile(MultipartFile file) throws IOException;
}
