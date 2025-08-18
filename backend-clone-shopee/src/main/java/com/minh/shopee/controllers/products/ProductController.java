package com.minh.shopee.controllers.products;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.AddProductDTO;
import com.minh.shopee.domain.dto.request.ListIdCartDetailDTO;
import com.minh.shopee.domain.dto.request.filters.FiltersProduct;
import com.minh.shopee.domain.dto.request.filters.SortFilter;
import com.minh.shopee.domain.dto.response.carts.CartDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.dto.response.projection.ProductProjection;
import com.minh.shopee.services.ProductSerivce;
import com.minh.shopee.services.utils.error.AppException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(ApiRoutes.API_BASE_V1 + ApiRoutes.PRODUCTS)
@RequiredArgsConstructor
public class ProductController {

    private final ProductSerivce productSerivce;

    @GetMapping("")
    @ApiDescription("Lấy danh sách sản phẩm")
    public ResponseEntity<Page<ProductResDTO>> getAllProducts(@PageableDefault(page = 0, size = 20) Pageable pageable) {

        Page<ProductResDTO> products = productSerivce.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    @ApiDescription("Tìm kiếm sản phẩm theo từ khoá")
    public ResponseEntity<Page<ProductResDTO>> searchProducts(
            @RequestParam(value = "keyword", required = false) String keyword,
            FiltersProduct filter, SortFilter sortFilter,
            Pageable pageable) {

        Page<ProductResDTO> products = productSerivce.searchProducts(keyword, filter, sortFilter, pageable);

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @ApiDescription("Lấy thông tin sản phẩm theo ID")
    public ResponseEntity<ProductProjection> getProductById(@PathVariable("id") Long id) {

        ProductProjection product = productSerivce.getProductById(id, ProductProjection.class);
        return ResponseEntity.ok(product);
    }

    @PostMapping("/add-to-cart")
    @ApiDescription("Thêm sản phẩm vào giỏ hàng")
    public ResponseEntity<String> addToCart(@RequestBody @Valid AddProductDTO productReq) {
        JwtAuthenticationToken auth = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userClaim = auth.getToken().getClaim("user");

        if (userClaim != null && userClaim.containsKey("id")) {
            String userId = userClaim.get("id").toString();
            Long userIdLong = Long.valueOf(userId);
            productSerivce.addProductToCart(productReq, userIdLong);

            return ResponseEntity.ok("Thêm sản phẩm vào giỏ hàng thành công");
        }
        throw new AppException(400, "Không thể thêm sản phẩm vào giỏ hàng", null);
    }

    @GetMapping("/get-cart")
    @ApiDescription("Xem giỏ hàng")
    public ResponseEntity<CartDTO> getCart() {
        JwtAuthenticationToken auth = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userClaim = auth.getToken().getClaim("user");
        if (userClaim != null && userClaim.containsKey("id")) {
            String userId = userClaim.get("id").toString();
            Long userIdLong = Long.valueOf(userId);
            CartDTO cart = productSerivce.getCart(userIdLong);

            return ResponseEntity.ok(cart);
        }
        throw new AppException(400, "Không thể lấy giỏ hàng", null);
    }

    @DeleteMapping("/remove-from-cart")
    @ApiDescription("Xoá sản phẩm khỏi giỏ hàng")
    public ResponseEntity<String> removeFromCart(@RequestBody AddProductDTO productReq) {
        Long productIdLong = productReq.getProductId();

        if (productIdLong == null || productIdLong <= 0) {
            throw new AppException(400, "Product ID is invalid", "Invalid product ID");
        }

        JwtAuthenticationToken auth = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userClaim = auth.getToken().getClaim("user");

        if (userClaim != null && userClaim.containsKey("id")) {
            Long userIdLong = Long.valueOf(userClaim.get("id").toString());
            this.productSerivce.removeFromCart(productIdLong, userIdLong);
            return ResponseEntity.ok("Xoá sản phẩm khỏi giỏ hàng thành công");
        }

        throw new AppException(400, "Unable to remove product from cart", "Không thể xoá sản phẩm khỏi giỏ hàng");
    }

    @DeleteMapping("/remove-list-from-cart")
    @ApiDescription("Xoá danh sách sản phẩm khỏi giỏ hàng")
    public ResponseEntity<String> removeListFromCart(@RequestBody ListIdCartDetailDTO req) {

        JwtAuthenticationToken auth = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userClaim = auth.getToken().getClaim("user");

        if (userClaim != null && userClaim.containsKey("id")) {
            Long userIdLong = Long.valueOf(userClaim.get("id").toString());
            this.productSerivce.removeListFromCart(req, userIdLong);
            return ResponseEntity.ok("Xoá sản phẩm khỏi giỏ hàng thành công");
        }

        throw new AppException(400, "Unable to remove product from cart", "Không thể xoá sản phẩm khỏi giỏ hàng");
    }

}
