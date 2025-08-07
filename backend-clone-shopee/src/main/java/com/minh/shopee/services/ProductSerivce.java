package com.minh.shopee.services;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.dto.request.AddProductDTO;
import com.minh.shopee.domain.dto.request.ListIdCartDetailDTO;
import com.minh.shopee.domain.dto.request.ProductReqDTO;
import com.minh.shopee.domain.dto.request.filters.FiltersProduct;
import com.minh.shopee.domain.dto.request.filters.SortFilter;
import com.minh.shopee.domain.dto.response.carts.CartDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;

public interface ProductSerivce {

  <T> Set<T> getAllProducts(Class<T> type);

  Page<ProductResDTO> getAllProducts(Pageable pageable);

  Page<ProductResDTO> searchProducts(String keyword, FiltersProduct filter, SortFilter sortFilte, Pageable pageable);

  ProductResDTO createAProduct(ProductReqDTO productDTO, List<MultipartFile> imageProduct);

  <T> T getProductById(long id, Class<T> type);

  void createListProduct(MultipartFile file);

  void addProductToCart(AddProductDTO productReq, Long userId);

  CartDTO getCart(Long userId);

  void removeFromCart(long productId, Long userId);

  void removeListFromCart(ListIdCartDetailDTO req, Long userId);

}
