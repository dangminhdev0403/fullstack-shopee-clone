package com.minh.shopee.domain.dto.response.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor

// ! Không thêm contructoer không thâm số
// ! tên và kiểu dữ liệu phải trùng với bảng gốc
public class UserDTO {
    private long id;
    private String email;
    private String name;

}
