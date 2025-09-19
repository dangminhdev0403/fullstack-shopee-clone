package com.minh.shopee.services.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.domain.dto.request.OrderItemRequest;
import com.minh.shopee.domain.dto.request.OrderShopUpdateDTO;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.request.filters.FilterOrderAdmin;
import com.minh.shopee.domain.dto.response.OverviewOrderDTO;
import com.minh.shopee.domain.model.Cart;
import com.minh.shopee.domain.model.Order;
import com.minh.shopee.domain.model.OrderDetail;
import com.minh.shopee.domain.model.Product;
import com.minh.shopee.domain.model.Shop;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.domain.specification.OrderDetailSpecification;
import com.minh.shopee.domain.specification.OrderSpecification;
import com.minh.shopee.repository.CartDetailRepository;
import com.minh.shopee.repository.CartRepository;
import com.minh.shopee.repository.GenericRepositoryCustom;
import com.minh.shopee.repository.OrderDetailRepository;
import com.minh.shopee.repository.OrderRepository;
import com.minh.shopee.repository.ProductRepository;
import com.minh.shopee.repository.ShopRepository;
import com.minh.shopee.services.OrderService;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j(topic = "orderService")
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

        private final OrderDetailRepository orderDetailRepository;
        private final OrderRepository orderRepository;
        private final ShopRepository shopRepository;
        private final ProductRepository productRepository;
        private final GenericRepositoryCustom<OrderDetail> orderDetailCustomRepo;
        private final CartRepository cartRepository;
        private final CartDetailRepository cartDetailRepository;

        @Override
        @Transactional
        public Order createOrder(CreateOrderRequest req, long userId) {
                log.info("Creating order for user: {}", userId);
                User currentUser = User.builder().id(userId).build();
                Order order = new Order();

                Map<Long, List<OrderItemRequest>> groupedByShop = req.getItems()
                                .stream()
                                .collect(Collectors.groupingBy(OrderItemRequest::getShopId));

                for (Map.Entry<Long, List<OrderItemRequest>> entry : groupedByShop.entrySet()) {
                        Long shopId = entry.getKey();
                        this.shopRepository.findById(shopId)
                                        .orElseThrow(() -> new AppException(
                                                        HttpStatus.NOT_FOUND.value(),
                                                        "Shop not found with id " + shopId,
                                                        "Không tìm thấy cửa hàng"));

                        // Tạo Order
                        order.setUser(currentUser);
                        order.setReceiverName(req.getReceiverName());
                        order.setReceiverAddress(req.getReceiverAddress());
                        order.setReceiverPhone(req.getReceiverPhone());
                        order.setStatus(OrderStatus.PENDING);

                        if (req.getPaymentMethod() != null) {
                                order.setPaymentMethod(req.getPaymentMethod());

                        }

                        List<OrderDetail> orderItems = new ArrayList<>();
                        BigDecimal subtotal = BigDecimal.ZERO;

                        for (OrderItemRequest itemReq : entry.getValue()) {
                                Long productId = itemReq.getProductId();
                                Product product = this.productRepository.findByIdAndShopId(productId, shopId)
                                                .orElseThrow(() -> {
                                                        log.error("Product with id {} not found in shop {}", productId,
                                                                        shopId);
                                                        return new AppException(
                                                                        HttpStatus.NOT_FOUND.value(),
                                                                        "Product not found",
                                                                        "Không tìm thấy sản phẩm trong cửa hàng");
                                                });

                                // Chỉ validate tồn kho (không trừ ở đây)
                                if (product.getStock() < itemReq.getQuantity()) {
                                        throw new AppException(HttpStatus.BAD_REQUEST.value(),
                                                        "Product " + product.getName()
                                                                        + " does not have enough quantity",
                                                        "Sản phẩm " + product.getName() + " không đủ số lượng");
                                }

                                OrderDetail item = new OrderDetail();
                                item.setOrder(order);
                                item.setProduct(product);
                                item.setQuantity(itemReq.getQuantity());
                                item.setPrice(product.getPrice());
                                orderItems.add(item);

                                subtotal = subtotal.add(
                                                product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
                        }

                        BigDecimal shippingFee = Optional.ofNullable(req.getShippingFee()).orElse(BigDecimal.ZERO);
                        BigDecimal discount = Optional.ofNullable(req.getDiscount()).orElse(BigDecimal.ZERO);
                        BigDecimal totalPrice = subtotal.add(shippingFee).subtract(discount);
                        if (totalPrice.compareTo(BigDecimal.ZERO) < 0) {
                                totalPrice = BigDecimal.ZERO;
                        }

                        order.setTotalPrice(totalPrice);
                        order.setOrderDetail(orderItems);

                        this.orderRepository.save(order);
                        this.orderDetailRepository.saveAll(orderItems);

                        log.info("Order created successfully: {}", order.getId());

                        // Xóa sản phẩm đã đặt khỏi giỏ hàng
                        Cart cartUser = this.cartRepository.findByUserId(userId).orElse(null);
                        if (cartUser != null) {
                                List<Long> orderedProductIds = req.getItems()
                                                .stream()
                                                .map(OrderItemRequest::getProductId)
                                                .toList();

                                this.cartDetailRepository.deleteByCartIdAndProductIdIn(cartUser.getId(),
                                                orderedProductIds);
                        }

                }
                return order;
        }

        @Override
        public <T> Page<T> getOrdersListByUser(Pageable pageable, Class<T> projectionClass, OrderStatus status) {

                long userId = SecurityUtils.getCurrentUserId();

                if (status != null) {
                        return orderRepository.findAllByUserIdAndStatus(userId, status, projectionClass, pageable);
                }
                return orderRepository.findAllByUserId(userId, projectionClass, pageable);
        }

        @Override
        public void cancelOrder(UpdateOrderDTO req) {
                long userId = SecurityUtils.getCurrentUserId();
                Order order = this.orderRepository.findOne(OrderSpecification.hasIdAndUser(req.getOrderId(), userId))
                                .orElseThrow(
                                                () -> new AppException(HttpStatus.NOT_FOUND.value(), "Order not found",
                                                                "Order witdh id" + req.getOrderId() + " not found"));

                if (!order.getStatus().canCancel()) {
                        throw new AppException(HttpStatus.BAD_REQUEST.value(), "Order can't be canceled",
                                        "Order không được hủy");

                }
                order.setStatus(OrderStatus.CANCELED);
                this.orderRepository.save(order);
        }

        @Override
        public <T> Page<T> getOrderDetailsListByShop(Pageable pageable, Class<T> projectionClass,
                        FilterOrderAdmin filter)
                        throws NoSuchMethodException {
                long userId = SecurityUtils.getCurrentUserId();
                Shop shop = shopRepository.findByOwnerId(userId)
                                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST.value(),
                                                "Shop not found", "Không tìm thấy shop của User này"));

                Specification<OrderDetail> spec = OrderDetailSpecification.filterByShopStatusKeyword(
                                shop.getId(),
                                filter.getStatus(),
                                filter.getKeyword());

                List<Long> ids = orderDetailCustomRepo.findIds(spec, pageable);

                if (ids.isEmpty())
                        return new PageImpl<>(List.of(), pageable, 0);

                List<T> details = orderDetailCustomRepo.findAllByIds(ids, projectionClass);
                long total = orderDetailRepository.count(spec);

                return new PageImpl<>(details, pageable, total);

        }

        @Override
        public OverviewOrderDTO overviewOrder() {
                long userId = SecurityUtils.getCurrentUserId();
                Shop shop = shopRepository.findByOwnerId(userId)
                                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST.value(),
                                                "Shop not found", "Không tìm thấy shop của User này"));

                long totalOrderDelivered = orderDetailRepository.count(
                                OrderDetailSpecification.hasShopId(shop.getId())
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.DELIVERED)));
                long totalOrderCanceled = orderDetailRepository.count(
                                OrderDetailSpecification.hasShopId(shop.getId())
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.CANCELED)));
                long totalOrderPending = orderDetailRepository.count(
                                OrderDetailSpecification.hasShopId(shop.getId())
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.PENDING)));
                long totalOrderProcessing = orderDetailRepository.count(
                                OrderDetailSpecification.hasShopId(shop.getId())
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.PROCESSING)));
                long totalOrderReturned = orderDetailRepository.count(
                                OrderDetailSpecification.hasShopId(shop.getId())
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.RETURNED)));
                long totalOrderShipped = orderDetailRepository.count(
                                OrderDetailSpecification.hasShopId(shop.getId())
                                                .and(OrderDetailSpecification.hasStatus(OrderStatus.SHIPPING)));

                return OverviewOrderDTO.builder()
                                .totalCancel(totalOrderCanceled)
                                .totalDelivered(totalOrderDelivered)
                                .totalPending(totalOrderPending)
                                .totalProcessing(totalOrderProcessing)
                                .totalReturned(totalOrderReturned)
                                .totalShipping(totalOrderShipped)
                                .build();
        }

        @Transactional
        @Override
        public OrderDetail updateOrderByShop(OrderShopUpdateDTO req) {
                long userId = SecurityUtils.getCurrentUserId();
                Shop shop = shopRepository.findByOwnerId(userId)
                                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST.value(),
                                                "Shop not found", "Không tìm thấy shop của User này"));

                OrderDetail orderDetailDb = orderDetailRepository.findOne(
                                OrderDetailSpecification.hasIdAndShopId(req.getId(), shop.getId()))
                                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(),
                                                "Order not found", "Không tìm thấy order cho shop này"));

                Order orderDb = orderDetailDb.getOrder();

                // ---- Xử lý cập nhật số lượng ----
                if (req.getQuantity() != null) {
                        Product product = orderDetailDb.getProduct();
                        long oldQuantity = orderDetailDb.getQuantity();
                        long newQuantity = req.getQuantity();
                        long diff = newQuantity - oldQuantity;

                        if (diff > 0 && diff > product.getStock()) {
                                throw new AppException(
                                                HttpStatus.BAD_REQUEST.value(),
                                                "Quantity is invalid",
                                                "Số lượng đặt vượt quá tồn kho");
                        }

                        product.setStock((int) (product.getStock() - diff));
                        orderDetailDb.setQuantity(newQuantity);

                        // ⚠️ Tổng tiền ở Order là cộng toàn bộ chi tiết, nên cần recalc thay vì chỉ
                        // update 1 item
                        BigDecimal totalPrice = orderDb.getOrderDetail().stream()
                                        .map(od -> od.getPrice().multiply(BigDecimal.valueOf(od.getQuantity())))
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                        orderDb.setTotalPrice(totalPrice);
                }

                // ---- Xử lý cập nhật trạng thái ----
                if (req.getStatus() != null) {
                        OrderStatus oldStatus = orderDetailDb.getShopStatus();
                        if (!oldStatus.canChangeTo(req.getStatus())) {
                                throw new AppException(HttpStatus.BAD_REQUEST.value(), "Status is invalid",
                                                "Trạng thái không hợp lý");
                        }
                        orderDetailDb.setShopStatus(req.getStatus());
                }

                // ---- Cập nhật lại trạng thái tổng của Order ----
                OrderStatus finalStatus = calculateOrderStatus(orderDb.getOrderDetail());
                orderDb.setStatus(finalStatus);

                this.orderDetailRepository.save(orderDetailDb);
                this.orderRepository.save(orderDb);
                this.productRepository.save(orderDetailDb.getProduct());

                return orderDetailDb;
        }

        public OrderStatus calculateOrderStatus(List<OrderDetail> details) {
                // Lấy danh sách các trạng thái shop_status trong OrderDetail
                Set<OrderStatus> statuses = details.stream()
                                .map(OrderDetail::getShopStatus)
                                .collect(Collectors.toSet());

                // ✅ Nếu tất cả các shop cùng 1 trạng thái -> lấy đúng trạng thái đó
                if (statuses.size() == 1) {
                        return statuses.iterator().next();
                }

                // ✅ Nếu có ít nhất 1 shop bị trả hàng -> coi toàn đơn là RETURNED
                if (statuses.contains(OrderStatus.RETURNED)) {
                        return OrderStatus.RETURNED;
                }

                // ✅ Nếu có shop nào còn ở PENDING/PROCESSING/SHIPPING
                // -> đơn vẫn chưa hoàn tất -> coi là PROCESSING
                if (statuses.contains(OrderStatus.PENDING)
                                || statuses.contains(OrderStatus.PROCESSING)
                                || statuses.contains(OrderStatus.SHIPPING)) {
                        return OrderStatus.PROCESSING;
                }

                // ✅ Nếu có mix giữa DELIVERED và CANCELED -> vẫn coi là PROCESSING
                // Vì đơn chưa hoàn tất toàn bộ (có giao, có huỷ)
                if (statuses.contains(OrderStatus.CANCELED) && statuses.contains(OrderStatus.DELIVERED)) {
                        return OrderStatus.PROCESSING;
                }

                // ⚠️ Trường hợp không match logic trên -> mặc định coi là PROCESSING
                return OrderStatus.PROCESSING;
        }

        @Override
        public void deleteOrder(Long id) {
                long userId = SecurityUtils.getCurrentUserId();
                Order order = this.orderRepository.findOne(OrderSpecification.hasIdAndUser(id, userId))
                                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Order not found",
                                                "Order not found"));
                this.orderRepository.delete(order);
        }

}
