package com.minh.shopee.domain.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class OverviewOrderDTO {
    private long totalPending;
    private long totalCancel;
    private long totalProcessing;
    private long totalShipping;
    private long totalDelivered;
    private long totalReturned;
}
