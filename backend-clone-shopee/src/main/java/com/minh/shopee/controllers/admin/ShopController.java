package com.minh.shopee.controllers.admin;

import java.net.URI;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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
import com.minh.shopee.domain.dto.request.ProductReqDTO;
import com.minh.shopee.domain.dto.request.ShopUpdateStatusDTO;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.request.UpdateShopDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.dto.response.projection.OrderProjection;
import com.minh.shopee.domain.dto.response.projection.admin.ProductShopProjection;
import com.minh.shopee.domain.model.Order;
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

    @GetMapping(ApiRoutes.PRODUCTS)
    @ApiDescription("Lấy danh sách sản phẩm")
    public ResponseEntity<Page<ProductShopProjection>> getlistProduct(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<ProductShopProjection> products = productSerivce.getAllProductsByShop(pageable);
        return ResponseEntity.ok(products);
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
    @ApiDescription("Cập nhật trạng thái cửa hàng")
    public ResponseEntity<String> updateShopStatus(@RequestBody @Valid ShopUpdateStatusDTO entity) {
        this.shopService.updateShopStatus(entity);
        return ResponseEntity.ok("Cập nhật thành công ");

    }

    @PutMapping("/update")
    @ApiDescription("Cập nhật thông tin cửa hàng")
    public ResponseEntity<String> updateShop(@RequestBody @Valid UpdateShopDTO entity) {
        this.shopService.updateShop(entity);
        return ResponseEntity.ok("Cập nhật thành công ");

    }

    @GetMapping(ApiRoutes.ORDERS)
    @ApiDescription("Lấy danh sách đơn hàng")
    public ResponseEntity<Page<OrderProjection>> getOrdersList(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<OrderProjection> orders = shopService.getOrdersList(pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping(ApiRoutes.ORDERS)
    @ApiDescription("Cập nhật  đơn hàng")
    public ResponseEntity<Order> updateOrder(@RequestBody @Valid UpdateOrderDTO entity) {
        Order order = this.shopService.updateOrder(entity);
        return ResponseEntity.ok(order);
    }

}
