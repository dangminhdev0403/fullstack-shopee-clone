package com.minh.shopee.controllers.admin;

import java.net.URI;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.ProductReqDTO;
import com.minh.shopee.domain.dto.request.ProductUpdateDTO;
import com.minh.shopee.domain.dto.request.filters.FiltersProductAdmin;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.dto.response.projection.admin.ProductImageProjection;
import com.minh.shopee.domain.dto.response.projection.admin.ProductShopProjection;
import com.minh.shopee.services.ProductSerivce;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("adminProductController")
@RequestMapping(ApiRoutes.PRODUCTS)
@RequiredArgsConstructor
public class ProductController {
    private final ProductSerivce productSerivce;

    /* ======================== GET ======================== */

    @GetMapping("")
    @ApiDescription("Lấy danh sách sản phẩm")
    public ResponseEntity<Page<ProductShopProjection>> getlistProduct(
            @PageableDefault(page = 0, size = 20) Pageable pageable,
            @ModelAttribute FiltersProductAdmin filtersProduct) {
        Page<ProductShopProjection> products = productSerivce.getAllProductsByShop(pageable, filtersProduct);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/images/{id}")
    @ApiDescription("Lấy hình ảnh sản phẩm")
    public ResponseEntity<ProductImageProjection> getProductImage(@PathVariable("id") Long id) {

        ProductImageProjection product = productSerivce.getProductById(id, ProductImageProjection.class);
        return ResponseEntity.ok(product);
    }

    /* ======================== POST ======================== */

    @PostMapping("")
    @ApiDescription("Tạo mới sản phẩm")
    public ResponseEntity<ProductResDTO> createAProduct(@ModelAttribute @Valid ProductReqDTO productDTO,
            @RequestParam(value = "images", required = true) List<MultipartFile> imagesProduct) {
        ProductResDTO productCreate = productSerivce.createAProduct(productDTO, imagesProduct);

        URI location = URI.create(ApiRoutes.API_BASE_V1 + ApiRoutes.PRODUCTS + "/" + productCreate.getId());
        return ResponseEntity.created(location)
                .body(productCreate);
    }

    @PostMapping("/import")
    @ApiDescription("Tạo danh sách sản phẩm từ file Excel")
    public ResponseEntity<String> createListProduct(
            @RequestParam(value = "fileProductExcel", required = false) MultipartFile file) {
        if (file != null) {
            this.productSerivce.createListProduct(file);
            return ResponseEntity.ok("Tạo danh sách sản phẩm thành công: ");
        }
        return ResponseEntity.ok("Tạo danh sách sản phẩm không thành công: ");
    }
    /* ======================== PUT ======================== */

    @PutMapping("")
    @ApiDescription("Cập nhật sản phẩm")
    public ResponseEntity<ProductUpdateDTO> updateAProduct(@ModelAttribute @Valid ProductUpdateDTO productDTO,
            @RequestParam(value = "images", required = false) List<MultipartFile> imagesProduct) {
        this.productSerivce.updateAProduct(productDTO, imagesProduct);
        return ResponseEntity.ok(productDTO);
    }

}
