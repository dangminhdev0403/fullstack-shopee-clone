package com.minh.shopee.controllers.admin;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
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
import com.minh.shopee.domain.dto.request.ProductReqDTO;
import com.minh.shopee.domain.dto.request.ShopUpdateStatusDTO;
import com.minh.shopee.domain.dto.request.UpdateShopDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.services.ProductSerivce;
import com.minh.shopee.services.ShopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("adminShopController")
@RequestMapping(ApiRoutes.SHOPS)
@RequiredArgsConstructor
public class ShopController {
    private final ProductSerivce productSerivce;
    private final ShopService shopService;

    @PostMapping(ApiRoutes.PRODUCTS)
    @ApiDescription("Tạo mới sản phẩm")
    public ResponseEntity<ProductResDTO> createAProduct(@ModelAttribute @Valid ProductReqDTO productDTO,
            @RequestParam(value = "imageProduct", required = false) List<MultipartFile> imagesProduct) {
        ProductResDTO productCreate = productSerivce.createAProduct(productDTO, imagesProduct);

        URI location = URI.create(ApiRoutes.API_BASE_V1 + ApiRoutes.PRODUCTS);
        return ResponseEntity.created(location)
                .body(productCreate);
    }

    @PostMapping(ApiRoutes.PRODUCTS + "/import")
    @ApiDescription("Tạo danh sách sản phẩm từ file Excel")
    public ResponseEntity<String> createListProduct(
            @RequestParam(value = "fileProductExcel", required = false) MultipartFile file) {
        if (file != null) {
            this.productSerivce.createListProduct(file);
            return ResponseEntity.ok("Tạo danh sách sản phẩm thành công: ");
        }
        return ResponseEntity.ok("Tạo danh sách sản phẩm không thành công: ");
    }

    @PutMapping("/update-status")
    public ResponseEntity<String> updateShopStatus(@RequestBody @Valid ShopUpdateStatusDTO entity) {
        this.shopService.updateShopStatus(entity);
        return ResponseEntity.ok("Cập nhật thành công ");

    }

    @PutMapping("/update")
    public ResponseEntity<String> updateShop(@RequestBody @Valid UpdateShopDTO entity) {
        this.shopService.updateShop(entity);
        return ResponseEntity.ok("Cập nhật thành công ");

    }

}
