package com.minh.shopee.services.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.constant.ProductStatus;
import com.minh.shopee.domain.constant.QuantityAction;
import com.minh.shopee.domain.dto.mappers.CartMapper;
import com.minh.shopee.domain.dto.request.AddProductDTO;
import com.minh.shopee.domain.dto.request.ListIdCartDetailDTO;
import com.minh.shopee.domain.dto.request.ProductReqDTO;
import com.minh.shopee.domain.dto.request.ProductUpdateDTO;
import com.minh.shopee.domain.dto.request.filters.FiltersProduct;
import com.minh.shopee.domain.dto.request.filters.FiltersProductAdmin;
import com.minh.shopee.domain.dto.request.filters.SortFilter;
import com.minh.shopee.domain.dto.response.carts.CartDTO;
import com.minh.shopee.domain.dto.response.products.ProductImageDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.dto.response.projection.CartProjection;
import com.minh.shopee.domain.dto.response.projection.ProductProjection;
import com.minh.shopee.domain.dto.response.projection.admin.ProductShopProjection;
import com.minh.shopee.domain.model.Cart;
import com.minh.shopee.domain.model.CartDetail;
import com.minh.shopee.domain.model.Category;
import com.minh.shopee.domain.model.Product;
import com.minh.shopee.domain.model.ProductImage;
import com.minh.shopee.domain.model.Shop;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.domain.specification.ProductImageSpecs;
import com.minh.shopee.domain.specification.ProductSpecification;
import com.minh.shopee.repository.CartDetailRepository;
import com.minh.shopee.repository.CartRepository;
import com.minh.shopee.repository.GenericRepositoryCustom;
import com.minh.shopee.repository.ProductImageRepository;
import com.minh.shopee.repository.ProductRepository;
import com.minh.shopee.repository.ShopRepository;
import com.minh.shopee.services.ProductSerivce;
import com.minh.shopee.services.utils.CommonUtils;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;
import com.minh.shopee.services.utils.files.ExcelHelper;
import com.minh.shopee.services.utils.files.UploadCloud;
import com.minh.shopee.services.utils.files.data.ProductData;
import com.minh.shopee.services.utils.mapper.ProductMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "ProductService")
public class ProductServiceImpl implements ProductSerivce {
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final UploadCloud uploadCloud;
    private final ExcelHelper excelHelper;
    private final GenericRepositoryCustom<Product> productCustomRepo;
    private final GenericRepositoryCustom<ProductImage> productImageCustomRepo;
    private final CartDetailRepository cartDetailRepository;
    private final CartRepository cartRepository;
    private final ShopRepository shopRepository;

    @Override
    public <T> Set<T> getAllProducts(Class<T> type) {

        return productRepository.findAllBy(type);
    }

    @Override
    public Page<ProductResDTO> getAllProducts(Pageable pageable) {
        Page<ProductProjection> products = productRepository.findAllByStatus(ProductStatus.ACTIVE, pageable,
                ProductProjection.class);
        List<ProductProjection> productList = products.getContent();

        List<ProductResDTO> dtoList = productList.stream()
                .map(product -> {
                    Optional<ProductImageDTO> firstImageOpt = this.productImageCustomRepo.findOne(
                            ProductImageSpecs.findFirstImageByProductId(product.getId()),
                            ProductImageDTO.class);

                    String imageUrl = firstImageOpt.map(ProductImageDTO::getImageUrl).orElse(null);
                    return ProductResDTO.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .price(product.getPrice())
                            .imageUrl(imageUrl)
                            .stock(product.getStock())
                            .build();
                }).toList();

        return new PageImpl<>(
                dtoList,
                pageable,
                products.getTotalElements());
    }

    @Override
    public Page<ProductResDTO> searchProducts(
            String keyword,
            FiltersProduct filter,
            SortFilter sortFilter,
            Pageable pageable) throws NoSuchMethodException {

        // áp sort vào pageable
        pageable = applySortFromFilter(pageable, sortFilter);
        Specification<Product> spec = buildProductSpecification(keyword, filter);

        // ===== Step 1: Lấy danh sách id theo paging =====
        List<Long> ids = this.productCustomRepo.findIds(spec, pageable);
        if (ids.isEmpty()) {
            return Page.empty(pageable);
        }

        // ===== Step 2: Lấy projection chi tiết theo ids =====
        List<ProductProjection> productList = this.productCustomRepo.findAllByIds(ids, ProductProjection.class);

        // ===== Step 3: Map sang DTO + lấy ảnh =====
        log.info("Mapping product to ProductResDTO, find image first by productId");
        List<ProductResDTO> dtoList = productList.stream()
                .map(product -> {
                    Optional<ProductImageDTO> firstImageOpt = this.productImageCustomRepo.findOne(
                            ProductImageSpecs.findFirstImageByProductId(product.getId()),
                            ProductImageDTO.class);

                    log.info("ProductId={} | name={} | foundImage={}",
                            product.getId(), product.getName(), firstImageOpt.isPresent());

                    String imageUrl = firstImageOpt.map(ProductImageDTO::getImageUrl).orElse(null);
                    return ProductResDTO.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .price(product.getPrice())
                            .imageUrl(imageUrl)
                            .stock(product.getStock())
                            .build();
                })
                .toList();

        // ===== Step 4: Count tổng =====
        long total = this.productRepository.count(spec);

        log.info("Keyword: '{}'", keyword);
        log.info("Filter: minPrice={}, maxPrice={}, stock={}, categoryId={}",
                filter != null ? filter.getMinPrice() : null,
                filter != null ? filter.getMaxPrice() : null,
                filter != null ? filter.getStock() : null,
                filter != null ? filter.getCategoryId() : null);
        log.info("Pageable: page={}, size={}, total={}", pageable.getPageNumber(), pageable.getPageSize(), total);

        return new PageImpl<>(dtoList, pageable, total);
    }

    @Override
    @Transactional
    public ProductResDTO createAProduct(ProductReqDTO productDTO, List<MultipartFile> imagesProduct) {
        long userId = SecurityUtils.getCurrentUserId();
        Shop shop = this.shopRepository.findByOwnerId(userId).orElseThrow(
                () -> new AppException(HttpStatus.BAD_REQUEST.value(), "Shop not found",
                        "Không tìm thấy shop của User này"));

        Category category = new Category();
        category.setId(productDTO.getCategoryId());

        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .shop(shop)
                .stock(productDTO.getStock())
                .category(category)
                .images(new ArrayList<>()) // ép luôn list rỗng
                .build();

        // Lưu trước để có productId (nếu bạn cần ID ngay cho ảnh)
        productRepository.save(product);

        if (imagesProduct != null && !imagesProduct.isEmpty()) {
            List<ProductImage> productImages = imagesProduct.stream()
                    .map(image -> {
                        String imageUrl = this.mapToProductImage(image, product).getImageUrl();
                        return ProductImage.builder()
                                .imageUrl(imageUrl)
                                .product(product)
                                .build();
                    })
                    .collect(Collectors.toList()); // mutable list

            product.getImages().addAll(productImages); // giữ nguyên collection Hibernate quản lý
        }

        return ProductMapper.toProductResDTO(product);
    }

    @Override
    @Transactional
    public ProductUpdateDTO updateAProduct(ProductUpdateDTO productDTO, List<MultipartFile> imagesProduct) {

        long userId = SecurityUtils.getCurrentUserId();
        Shop shop = this.shopRepository.findByOwnerId(userId).orElseThrow(
                () -> new AppException(HttpStatus.BAD_REQUEST.value(), "Shop not found",
                        "Không tìm thấy shop của User này"));
        Product product = this.productRepository.findByIdAndShopId(productDTO.getId(), shop.getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Product not found",
                        "Không tìm thấy sản phẩm cho shop này"));
        if (shop.getId() != product.getShop().getId()) {
            throw new AccessDeniedException("Bạn không có quyền cập nhật sản phẩm này.");
        }
        if (productDTO.getCategoryId() != null) {
            Category category = new Category();
            category.setId(productDTO.getCategoryId());
            product.setCategory(category);
        }
        // Cập nhật ảnh
        if (imagesProduct != null && !imagesProduct.isEmpty()) {
            List<ProductImage> productImages = imagesProduct.stream()
                    .map(image -> mapToProductImage(image, product)) // dùng trực tiếp, không build lại
                    .toList();

            product.getImages().clear(); // xoá ảnh cũ trong entity
            product.getImages().addAll(productImages); // thêm ảnh mới
        }

        BeanUtils.copyProperties(productDTO, product, CommonUtils.getNullPropertyNames(productDTO));
        log.info("Updating product: {}", product);
        Product updatedProduct = this.productRepository.save(product);
        BeanUtils.copyProperties(updatedProduct, productDTO);
        productDTO.setCategoryId(updatedProduct.getCategory().getId());
        return productDTO;
    }

    @Transactional
    public ProductImage mapToProductImage(MultipartFile image, Product product) {
        try {
            if (image != null && product.getImages() != null && !product.getImages().isEmpty()) {
                // Xóa ảnh cũ trên Cloudinary
                for (ProductImage productImage : new ArrayList<>(product.getImages())) {
                    uploadCloud.deleteFile(productImage.getImageUrl());
                }

                // Xóa khỏi entity -> Hibernate sẽ tự xử lý orphanRemoval
                product.getImages().clear();
            }

            // Upload ảnh mới
            String imageUrl = uploadCloud.handleSaveUploadFile(image, "products");

            ProductImage newImage = ProductImage.builder()
                    .imageUrl(imageUrl)
                    .product(product)
                    .build();

            // Thêm vào entity để Hibernate persist
            product.getImages().add(newImage);

            return newImage;

        } catch (IOException e) {
            throw new IllegalArgumentException("Lỗi upload ảnh", e);
        }
    }

    @Override
    public void createListProduct(MultipartFile file) {
        try {
            long userId = SecurityUtils.getCurrentUserId();
            Shop shop = shopRepository.findByOwnerId(userId)
                    .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST.value(),
                            "Shop not found", "Không tìm thấy shop của User này"));
            ProductData productData = this.excelHelper.readExcelProductFile(file);
            List<Product> listProducts = productData.getListProducts();
            List<ProductImage> listProductImages = productData.getListProductImages();
            if (listProducts != null && !listProducts.isEmpty()) {
                listProducts.forEach(p -> p.setShop(shop));
                log.info("Save List product: {}", listProducts);
                productRepository.saveAll(listProducts);
            }
            if (listProductImages != null && !listProductImages.isEmpty()) {
                log.info("Save List product image: {}", listProductImages);
                productImageRepository.saveAll(listProductImages);
            }
        } catch (IOException e) {
            log.error("Error reading excel file: {}", e.getMessage());
            e.printStackTrace();
        }

    }

    private Pageable applySortFromFilter(Pageable pageable, SortFilter sortFilter) {
        log.info("Applying sort from filter: {}", sortFilter);
        if (sortFilter != null) {

            // map lại tên field
            String sortBy = switch (sortFilter.getSortBy()) {
                case "ctime" -> "createdAt";
                case "price" -> "price"; // đảm bảo đúng tên entity
                default -> sortFilter.getSortBy();
            };

            // map lại order
            String order = sortFilter.getOrder();
            Sort.Direction direction;

            if (order == null) {
                direction = Sort.Direction.DESC;
            } else {
                switch (order.toLowerCase()) {
                    case "asc", "ascending" -> direction = Sort.Direction.ASC;
                    case "desc", "descending" -> direction = Sort.Direction.DESC;
                    default -> throw new IllegalArgumentException("Invalid sort order: " + order);
                }
            }

            Sort sort = Sort.by(direction, sortBy);
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }

        // default sort
        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").descending());
    }

    private Specification<Product> buildProductSpecification(String keyword, FiltersProduct filter) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasStatus(ProductStatus.ACTIVE));

        if (keyword != null && !keyword.isEmpty()) {
            log.info("Searching product with keyword: {}", keyword);
            spec = spec.and(ProductSpecification.hasName(keyword));
        }
        if (filter != null) {
            if (filter.getMinPrice().isPresent() && filter.getMaxPrice().isPresent()) {
                BigDecimal minPrice = new BigDecimal(filter.getMinPrice().get());
                BigDecimal maxPrice = new BigDecimal(filter.getMaxPrice().get());
                spec = spec.and(ProductSpecification.hasPriceRange(minPrice, maxPrice));
            }
            if (filter.getStock().isPresent()) {
                Integer stock = Integer.parseInt(filter.getStock().get());
                spec = spec.and(ProductSpecification.hasStock(stock));
            }
            if (filter.getCategoryId().isPresent()) {
                spec = spec.and(ProductSpecification.hasCategoryId(filter.getCategoryId().get()));
            }
        }
        return spec;
    }

    @Override
    public <T> T getProductById(long id, Class<T> type) {
        log.info("Fetching product by id: {} with projection type: {}", id, type.getSimpleName());
        Optional<T> product = this.productRepository.findById(id, type);
        if (product.isEmpty()) {
            log.error("Product not found with id: {}", id);
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Product not found",
                    "Product with id " + id + " not found");
        }
        return product.get();
    }

    @Override
    public void addProductToCart(AddProductDTO productReq, Long userId) {
        Product productDB = this.productRepository.findById(productReq.getProductId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Product not found",
                        "Product with id " + productReq.getProductId() + " not found"));
        int stockProduct = productDB.getStock();

        Cart cart = this.cartRepository.findByUserId(userId).orElseGet(() -> {
            log.info("Cart not found, creating new cart for user id: {}", userId);
            Cart newCart = new Cart();
            User user = new User();
            user.setId(userId);
            newCart.setUser(user);
            return this.cartRepository.save(newCart);
        });

        CartDetail cartDetail = this.cartDetailRepository
                .findByCartIdAndProductId(cart.getId(), productReq.getProductId());

        if (cartDetail != null) {
            if (productReq.getAction() == QuantityAction.INCREASE) {
                int quantity = cartDetail.getQuantity() + productReq.getQuantity();
                if (quantity > stockProduct) {
                    throw new AppException(HttpStatus.BAD_REQUEST.value(), "Quantity exceeds stock",
                            "Không thể tăng số lượng vượt quá giới hạn hàng tồn kho");
                }
                cartDetail.setQuantity(quantity);
            } else if (productReq.getAction() == QuantityAction.DECREASE) {
                if (productReq.getQuantity() > cartDetail.getQuantity()) {
                    throw new AppException(HttpStatus.BAD_REQUEST.value(), "Quantity is not enough",
                            "Quantity is not enough");
                }
                int newQty = cartDetail.getQuantity() - productReq.getQuantity();
                if (newQty == 0) {
                    this.cartDetailRepository.delete(cartDetail);
                    return;
                }
                cartDetail.setQuantity(newQty);
            }

            this.cartDetailRepository.save(cartDetail);
        } else {
            // ❗ Sửa phần này: cho phép thêm sản phẩm mới nếu action là INCREASE
            if (productReq.getAction() == QuantityAction.INCREASE) {
                CartDetail newDetail = CartDetail.builder()
                        .quantity(productReq.getQuantity())
                        .product(productDB)
                        .cart(cart)
                        .build();
                this.cartDetailRepository.save(newDetail);
            } else {
                throw new AppException(HttpStatus.BAD_REQUEST.value(), "Product not in cart",
                        "Cannot decrease product that is not in cart");
            }
        }
    }

    @Override
    public CartDTO getCart(Long userId) {

        CartProjection cart = this.cartRepository.findProjectedByUserId(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Cart not found",
                        "Cart for user with id " + userId + " not found"));
        return CartMapper.toCartDTO(cart);
    }

    @Override
    public void removeFromCart(long productId, Long userId) {
        Cart cart = this.cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Cart not found",
                        "Cart for user with id " + userId + " not found"));
        CartDetail cartDetail = this.cartDetailRepository.findByCartIdAndProductId(cart.getId(), productId);
        if (cartDetail != null) {
            this.cartDetailRepository.delete(cartDetail);
            log.info("Removed product with id {} from cart for user id {}", productId, userId);
            return;
        } else {
            log.error("Cannot remove product with id {} that is not in cart for user id {}", productId, userId);
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Product not in cart",
                    "Cannot remove product that is not in cart");
        }
    }

    @Override
    public void removeListFromCart(ListIdCartDetailDTO req, Long userId) {
        List<Long> ids = req.getIds();
        List<CartDetail> cartDetails = cartDetailRepository.findAllById(ids);

        // Kiểm tra quyền sở hữu
        boolean hasInvalid = cartDetails.stream().anyMatch(cd -> !cd.getCart().getUser().getId().equals(userId));

        if (hasInvalid) {
            throw new AccessDeniedException("Bạn không có quyền xóa một hoặc nhiều sản phẩm.");
        }
        cartDetailRepository.deleteAll(cartDetails);
    }

    @Override
    public Page<ProductShopProjection> getAllProductsByShop(Pageable pageable, FiltersProductAdmin filtersProduct) {
        long userId = SecurityUtils.getCurrentUserId();
        Shop shop = this.shopRepository.findByOwnerId(userId).orElseThrow(
                () -> new AppException(HttpStatus.BAD_REQUEST.value(), "Shop not found",
                        "Không tìm thấy shop của User này"));

        Specification<Product> spec = Specification.where(null);
        spec = spec.and(ProductSpecification.hasShopId(shop.getId()));
        if (filtersProduct.getCategoryId() != null) {
            spec = spec.and(ProductSpecification.hasCategoryId(filtersProduct.getCategoryId()));
        }
        if (filtersProduct.getKeyword() != null) {
            spec = spec.and(ProductSpecification.hasKeyword(filtersProduct.getKeyword()));
        }
        // 1) Lấy ids theo pageable (chỉ select id, không join)
        List<Long> ids = this.productCustomRepo.findIds(spec, pageable);
        // 2) Lấy tổng số để trả trong Page (dùng productRepository.count(spec) nếu bạn
        // có JpaSpecificationExecutor)
        long total = this.productRepository.count(spec);

        // nếu không có id nào -> trả page rỗng
        if (ids.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, total);
        }
        // 3) Lấy projection cho các ids (unpaged) — an toàn với join images
        List<ProductShopProjection> list;
        try {
            list = this.productCustomRepo.findAllByIds(ids, ProductShopProjection.class);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }

        // 4) Sắp lại theo thứ tự ids (để giữ thứ tự paging)
        Map<Long, ProductShopProjection> map = list.stream()
                .collect(Collectors.toMap(ProductShopProjection::getId, Function.identity()));
        List<ProductShopProjection> ordered = ids.stream()
                .map(map::get)
                .filter(Objects::nonNull)
                .toList();
        // 5) Trả Page
        return new PageImpl<>(ordered, pageable, total);
    }

    @Override
    @Transactional
    public void restoreCart(List<AddProductDTO> cartRestores) {
        long userId = SecurityUtils.getCurrentUserId();
        if (cartRestores == null || cartRestores.isEmpty()) {
            return;
        }

        for (AddProductDTO item : cartRestores) {
            try {
                this.addProductToCart(item, userId);
            } catch (AppException ex) {
                // Nếu có lỗi (ví dụ hết hàng) thì bỏ qua hoặc log lại
                log.warn("Cannot restore productId={} for userId={} | reason={}",
                        item.getProductId(), userId, ex.getMessage());
                throw new AppException(HttpStatus.BAD_REQUEST.value(), "Có lỗi xảy ra",
                        ex.getMessage());
            }
        }
    }
}
