package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.minh.shopee.domain.dto.response.projection.RoleProjection;
import com.minh.shopee.domain.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    <T> Page<T> findAllBy(Class<T> type, Pageable pageable);

    Page<RoleProjection> findAllProjectedBy(Pageable pageable);

    boolean existsByName(String name);

    <T> Optional<T> findById(Long id, Class<T> type);

    Optional<RoleProjection> findProjectedById(Long id);

    Optional<Role> findByName(String name);

    // ⚡ Thêm lại method gốc để không bị shadow
    @Override
    Optional<Role> findById(Long id);
}
