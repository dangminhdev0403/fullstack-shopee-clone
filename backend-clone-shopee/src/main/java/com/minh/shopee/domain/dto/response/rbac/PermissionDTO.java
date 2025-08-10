
package com.minh.shopee.domain.dto.response.rbac;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class PermissionDTO {
    private Long id;
    private String method;
    private String descrition;
}
