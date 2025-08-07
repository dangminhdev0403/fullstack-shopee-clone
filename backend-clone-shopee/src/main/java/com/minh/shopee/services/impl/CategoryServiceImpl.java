package com.minh.shopee.services.impl;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.model.Category;
import com.minh.shopee.repository.CategoryRepository;
import com.minh.shopee.services.CategoryService;
import com.minh.shopee.services.utils.error.AppException;
import com.minh.shopee.services.utils.files.ExcelHelper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "CategoryService")
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ExcelHelper excelHelper;

    @Override
    public <T> Page<T> getAllCategories(Class<T> type, Pageable pageable) {
        log.info("Fetching list of categories with projection type ok: {}", type.getSimpleName());
        return this.categoryRepository.findAllBy(type, pageable);

    }

    @Override
    public Category createCategory(Category category) {

        Category categoryFound = this.categoryRepository.findByName(category.getName());
        if (categoryFound != null) {
            log.error("Category already exists: {}", category);
            throw new AppException(HttpStatus.CONFLICT.value(), "Category already exists",
                    "Category " + category.getName() + " already exists");
        }

        log.info("Creating category: {}", category);
        return this.categoryRepository.save(category);
    }

    @Override
    public <T> T getCategoryById(Long id, Class<T> type) {
        log.info("Fetching category by id: {} with projection type: {}", id, type.getSimpleName());
        Optional<T> category = this.categoryRepository.findById(id, type);
        if (category.isEmpty()) {
            log.error("Category not found with id: {}", id);
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Category not found",
                    "Category with id " + id + " not found");
        }

        return category.get();
    }

    @Override
    public Category updateCategory(Category entity) {
        Category categoryFound = this.getCategoryById(entity.getId(), Category.class);
        log.info("Updating category with id {}: {}", categoryFound.getId(), categoryFound);

        categoryFound.setName(entity.getName());
        this.categoryRepository.save(categoryFound);

        return entity;
    }

    @Override
    public void deleteCategory(Long id) {
        Category categoryFound = this.getCategoryById(id, Category.class);
        log.info("Deleting category with id {}: {}", categoryFound.getId(), categoryFound);
        this.categoryRepository.delete(categoryFound);
    }

    @Override
    public void createListCategory(MultipartFile fileExcel) throws IOException {
        List<Category> categories = this.excelHelper.readExcelCategoryFile(fileExcel);
        List<Category> categoriesDb = this.categoryRepository.findAll();
        categories.removeIf(category -> categoriesDb.stream()
                .anyMatch(categoryDb -> categoryDb.getName().equalsIgnoreCase(category.getName())));
        this.categoryRepository.saveAll(categories);
        log.info("Created list of categories: {}", categories);
    }

}
