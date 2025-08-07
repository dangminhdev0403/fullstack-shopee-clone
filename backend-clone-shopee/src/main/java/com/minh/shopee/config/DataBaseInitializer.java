package com.minh.shopee.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.model.User;
import com.minh.shopee.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j(topic = "DataBaseInitializer")
@RequiredArgsConstructor
public class DataBaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting database initialization...");
        initializeUsers();

    }

    @Transactional
    private void initializeUsers() {
        long count = userRepository.count();

        if (count == 0) {
            log.info("No users found, creating default user...");
            User defaultUser = new User();
            defaultUser.setEmail("admin@gmail.com");
            defaultUser.setName("ADMIN");
            defaultUser.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(defaultUser);
            log.info("Default user created successfully.");
        }

    }

}
