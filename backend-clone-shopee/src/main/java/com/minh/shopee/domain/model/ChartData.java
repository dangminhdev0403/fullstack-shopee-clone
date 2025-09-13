
package com.minh.shopee.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ChartData {
    private String name; // T1, T2, T3... hoặc ngày
    private Long orders; // số đơn
    private Double revenue; // doanh thu
    private Long customers;

}
