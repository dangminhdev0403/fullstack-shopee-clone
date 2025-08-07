package com.minh.shopee.services;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.model.Category;

public interface CategoryService {
    <T> Page<T> getAllCategories(Class<T> type, Pageable pageable);

    Category createCategory(Category category);

    void createListCategory(MultipartFile fileName) throws IOException;

    <T> T getCategoryById(Long id, Class<T> type);

    Category updateCategory(Category entity);

    void deleteCategory(Long id);
}
