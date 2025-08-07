package com.minh.shopee.controllers.products;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.dto.request.AddProductDTO;
import com.minh.shopee.domain.dto.request.ListIdCartDetailDTO;
import com.minh.shopee.domain.dto.request.ProductReqDTO;
import com.minh.shopee.domain.dto.request.filters.FiltersProduct;
import com.minh.shopee.domain.dto.request.filters.SortFilter;
import com.minh.shopee.domain.dto.response.carts.CartDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.model.Product;
import com.minh.shopee.services.ProductSerivce;
import com.minh.shopee.services.utils.error.AppException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductSerivce productSerivce;

    @PostMapping("")
    public ResponseEntity<ProductResDTO> createAProduct(@ModelAttribute @Valid ProductReqDTO productDTO,
            @RequestParam(value = "imageProduct", required = false) List<MultipartFile> imagesProduct) {
        ProductResDTO productCreate = productSerivce.createAProduct(productDTO, imagesProduct);

        URI location = URI.create("/api/v1/products");
        return ResponseEntity.created(location)
                .body(productCreate);
    }

    @PostMapping("/import")
    public ResponseEntity<String> createListProduct(
            @RequestParam(value = "fileProductExcel", required = false) MultipartFile file) {
        if (file != null) {
            this.productSerivce.createListProduct(file);
            return ResponseEntity.ok("Tạo danh sách sản phẩm thành công: ");
        }
        return ResponseEntity.ok("Tạo danh sách sản phẩm không thành công: ");
    }

    @GetMapping("")
    public ResponseEntity<Page<ProductResDTO>> getAllProducts(@PageableDefault(page = 0, size = 20) Pageable pageable) {

        Page<ProductResDTO> products = productSerivce.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResDTO>> searchProducts(
            @RequestParam(value = "keyword", required = false) String keyword,
            FiltersProduct filter, SortFilter sortFilter,
            Pageable pageable) {

        Page<ProductResDTO> products = productSerivce.searchProducts(keyword, filter, sortFilter, pageable);

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Long id) {

        Product product = productSerivce.getProductById(id, Product.class);
        return ResponseEntity.ok(product);
    }

    @PostMapping("/add-to-cart")
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
