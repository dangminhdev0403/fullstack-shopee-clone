package com.minh.shopee.controllers.products;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.CategoryDTO;
import com.minh.shopee.domain.model.Category;
import com.minh.shopee.services.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(ApiRoutes.API_BASE_V1 + ApiRoutes.CATEGORIES)
@RequiredArgsConstructor
@Slf4j(topic = "CategoryController")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping()
    @ApiDescription("Lấy danh sách danh mục")
    public ResponseEntity<Page<CategoryDTO>> getAllCategories(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<CategoryDTO> categories = this.categoryService.getAllCategories(CategoryDTO.class, pageable);

        return ResponseEntity.ok(categories);
    }

  

}
