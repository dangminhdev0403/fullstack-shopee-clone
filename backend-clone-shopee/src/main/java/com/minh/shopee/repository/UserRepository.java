package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.minh.shopee.domain.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // <T> List<T> findAllBy(Class<T> type);

    Optional<User> findByEmail(String email);

    <T> Optional<T> findByEmail(String email, Class<T> type);

    Optional<User> findByEmailAndRefreshToken(String email, String refreshToken);

    <T> Optional<T> findByEmailAndRefreshToken(String email, String refreshToken, Class<T> type);

    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.refreshToken = :refreshToken WHERE u.email = :email")
    int updateRefreshTokenByEmail(String email, String refreshToken);

}
