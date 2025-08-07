package com.minh.shopee.services.utils;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.response.users.UserAuthDTO;
import com.minh.shopee.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j(topic = "CustomUserDetailsService")
@Component("userDetailsService")
@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Authenticating user with username: {}", username);

        try {
            UserAuthDTO currentUser = this.userService.findByUsername(username, UserAuthDTO.class);

            log.info("User authenticated successfully: {}", username);

            return new org.springframework.security.core.userdetails.User(
                    currentUser.getEmail(),
                    currentUser.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        } catch (UsernameNotFoundException ex) {
            log.warn("User not found during authentication: {}", username);
            throw ex;

        } catch (Exception e) {
            log.error("Unexpected error during user authentication for username: {}", username, e);
            throw new UsernameNotFoundException("Unexpected error occurred", e);
        }
    }
}
