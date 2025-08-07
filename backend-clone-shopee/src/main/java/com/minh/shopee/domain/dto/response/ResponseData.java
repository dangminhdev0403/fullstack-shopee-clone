package com.minh.shopee.domain.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ResponseData<T> {

    private int status;
    private String error;
    private Object message;
    private T data;

}
