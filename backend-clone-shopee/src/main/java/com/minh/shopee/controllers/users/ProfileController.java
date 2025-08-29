package com.minh.shopee.controllers.users;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.dto.request.ChangePassDTO;
import com.minh.shopee.domain.dto.request.UserReqDTO;
import com.minh.shopee.domain.dto.response.users.ProfileDTO;
import com.minh.shopee.domain.dto.response.users.UpdateUserResDTO;
import com.minh.shopee.services.UserService;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;

import jakarta.validation.Valid;
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
            @ModelAttribute @Valid UserReqDTO userRequest) throws IOException {
      

        UpdateUserResDTO updatUser = this.userService.updateProfile( userRequest, avatarFile);

        return ResponseEntity.ok().body(updatUser);
    }

    @PutMapping("/change-password")
    @ApiDescription("Thay đổi mật khẩu")
    public ResponseEntity<String> putMethodName(@RequestBody @Valid ChangePassDTO entity) {

        this.userService.changePassword(entity);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @GetMapping("")
    public ResponseEntity<ProfileDTO> getMethodName() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(401, "Unauthorized", "Không tìm thấy user"));
        ProfileDTO profileDTO = this.userService.findByUsername(email, ProfileDTO.class);

        return ResponseEntity.ok(profileDTO);
    }

}