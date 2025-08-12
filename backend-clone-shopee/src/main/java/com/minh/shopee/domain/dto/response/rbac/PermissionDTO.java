
package com.minh.shopee.domain.dto.response.rbac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
@AllArgsConstructor
public class PermissionDTO {

    private String method;
    private String path;
    private String descrition;

}
