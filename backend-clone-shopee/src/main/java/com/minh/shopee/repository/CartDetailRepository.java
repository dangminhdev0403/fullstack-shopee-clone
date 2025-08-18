package com.minh.shopee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.minh.shopee.domain.model.CartDetail;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long>, JpaSpecificationExecutor<CartDetail> {
    CartDetail findByCartIdAndProductId(Long cartId, Long productId);

    void deleteAllByIdIn(List<Long> ids);

    List<CartDetail> findAllById(Iterable<Long> ids);

    List<CartDetail> findByCartId(Long cartId);

    void deleteByCartIdAndProductIdIn(Long cartId, List<Long> productIds);

}
