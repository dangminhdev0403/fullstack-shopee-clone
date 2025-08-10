package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.minh.shopee.domain.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    <T> Page<T> findAllBy(Class<T> type, Pageable pageable);

    boolean existsByName(String name);

    <T> Optional<T> findById(Long id, Class<T> type);

}
