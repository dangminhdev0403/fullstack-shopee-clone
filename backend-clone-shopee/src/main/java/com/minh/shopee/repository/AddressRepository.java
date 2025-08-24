package com.minh.shopee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.minh.shopee.domain.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>, JpaSpecificationExecutor<Address> {
    List<Address> findAllByUserId(Long userId);

    Long countByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long addressId, Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
    void updateAllDefaultFalse(@Param("userId") Long userId);

}
