package com.minh.shopee.controllers.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.UserResgisterDTO;
import com.minh.shopee.domain.dto.response.users.UserDTO;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(ApiRoutes.USERS)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("")
    @ApiDescription("Tạo người dùng")
    public ResponseEntity<User> createUser(@RequestBody UserResgisterDTO user) {
        User userCreated = userService.createUser(user);
        return ResponseEntity.ok().body(userCreated);

    }

    @GetMapping("/search")
    @ApiDescription("Tìm kiếm người dùng theo từ khoá")
    public ResponseEntity<Page<UserDTO>> searchUsers(@RequestParam("keyword") String keyword,
            Pageable pageable) {
        Page<UserDTO> user = userService.searchUsers(keyword, pageable);
        return ResponseEntity.ok(user);
    }

}
