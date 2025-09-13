package com.minh.shopee.services.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.dto.response.analytics.CommonAnalyticsDTO;
import com.minh.shopee.domain.dto.response.projection.admin.analytics.ProductOverviewDTO;
import com.minh.shopee.domain.model.ChartData;
import com.minh.shopee.domain.model.OrderDetail;
import com.minh.shopee.domain.model.Shop;
import com.minh.shopee.domain.specification.OrderDetailSpecification;
import com.minh.shopee.domain.specification.ProductSpecification;
import com.minh.shopee.repository.OrderDetailRepository;
import com.minh.shopee.repository.ProductRepository;
import com.minh.shopee.repository.ShopRepository;
import com.minh.shopee.repository.UserRepository;
import com.minh.shopee.services.AnalyticsService;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsSerivceImpl implements AnalyticsService {
        private final ProductRepository productRepository;
        private final ShopRepository shopRepository;
        private final OrderDetailRepository orderDetailRepository;
        private final UserRepository userRepository;

        @Override
        public ProductOverviewDTO getProductOverview() {
                long userId = SecurityUtils.getCurrentUserId();
                Shop shop = this.shopRepository.findByOwnerId(userId).orElseThrow(
                                () -> new AppException(HttpStatus.BAD_REQUEST.value(), "Shop not found",
                                                "Không tìm thấy shop của User này"));
                long totalSold = productRepository
                                .count(ProductSpecification.hasBeenSold()
                                                .and(ProductSpecification.hasShopId(shop.getId())));
                long totalZeroStock = productRepository
                                .count(ProductSpecification.isZeroStock()
                                                .and(ProductSpecification.hasShopId(shop.getId())));

                return ProductOverviewDTO.builder().sold(totalSold).outOfStock(totalZeroStock).build();
        }

        @Override
        public CommonAnalyticsDTO getCommonAnalytics() {
                CommonAnalyticsDTO commonAnalyticsDTO = new CommonAnalyticsDTO();
                long userId = SecurityUtils.getCurrentUserId();
                Shop shop = this.shopRepository.findByOwnerId(userId).orElseThrow(
                                () -> new AppException(HttpStatus.BAD_REQUEST.value(), "Shop not found",
                                                "Không tìm thấy shop của User này"));
                long totalProduct = productRepository.count(
                                (ProductSpecification.hasShopId(shop.getId())));
                long totalOrderNow = this.orderDetailRepository.count(OrderDetailSpecification.hasShopId(shop.getId())
                                .and(OrderDetailSpecification.createdToday()));
                long totalCustomer = this.userRepository.count();

                commonAnalyticsDTO.setTotalProducts(totalProduct);
                commonAnalyticsDTO.setToltalOrdersNow(totalOrderNow);
                commonAnalyticsDTO.setTotalCustomer(totalCustomer);

                return commonAnalyticsDTO;
        }

        @Override
        public List<ChartData> getWeeklyData(Instant start, Instant end) {
                List<OrderDetail> orderDetails = orderDetailRepository.findAll(
                                OrderDetailSpecification.createdBetween(start, end)
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.DELIVERED)));

                // group theo ngày
                Map<LocalDate, List<OrderDetail>> grouped = orderDetails.stream()
                                .collect(Collectors.groupingBy(
                                                od -> od.getOrder().getCreatedAt()
                                                                .atZone(ZoneId.systemDefault())
                                                                .toLocalDate()));

                return grouped.entrySet().stream()
                                .sorted(Map.Entry.comparingByKey())
                                .map(entry -> {
                                        LocalDate date = entry.getKey();
                                        List<OrderDetail> details = entry.getValue();

                                        long orders = details.stream()
                                                        .map(OrderDetail::getOrder)
                                                        .distinct()
                                                        .count();

                                        double revenue = details.stream()
                                                        .mapToDouble(d -> d.getQuantity() * d.getPrice().doubleValue())
                                                        .sum();

                                        long customers = details.stream()
                                                        .map(d -> d.getOrder().getUser().getId())
                                                        .distinct()
                                                        .count();

                                        return new ChartData(date.toString(), orders, revenue, customers);
                                })
                                .collect(Collectors.toList());
        }

}
