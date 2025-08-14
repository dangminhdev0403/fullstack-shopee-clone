package com.minh.shopee.controllers.users;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.dto.request.UserReqDTO;
import com.minh.shopee.domain.dto.response.users.UpdateUserResDTO;
import com.minh.shopee.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j(topic = "FileController")
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<UpdateUserResDTO> updateProfile(
            @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile,
            @ModelAttribute UserReqDTO userRequest) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UpdateUserResDTO updatUser = this.userService.updateProfile(email, userRequest, avatarFile);

        return ResponseEntity.ok().body(updatUser);
    }

}