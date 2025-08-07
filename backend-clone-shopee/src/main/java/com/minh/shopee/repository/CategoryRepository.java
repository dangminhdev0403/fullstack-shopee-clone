package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.minh.shopee.domain.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    Category findByName(String name);

    <T> Page<T> findAllBy(Class<T> type, Pageable pageable);

    <T> Optional<T> findByName(String name, Class<T> type);

    <T> Optional<T> findById(Long id, Class<T> type);

}
