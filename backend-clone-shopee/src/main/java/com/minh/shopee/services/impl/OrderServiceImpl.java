package com.minh.shopee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.domain.dto.request.OrderItemRequest;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.response.projection.OrderProjection;
import com.minh.shopee.domain.model.Cart;
import com.minh.shopee.domain.model.Order;
import com.minh.shopee.domain.model.OrderDetail;
import com.minh.shopee.domain.model.Product;
import com.minh.shopee.domain.model.User;
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
    private final GenericRepositoryCustom<Order> orderCustomRepo;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;

    @Override
    @Transactional
    public void createOrder(CreateOrderRequest req, long userId) {
        log.info("Creating order for user: {}", userId);
        User currentUser = User.builder().id(userId).build();
        // Nhóm sản phẩm theo shopId
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
            Order order = new Order();
            order.setUser(currentUser);
            order.setReceiverName(req.getReceiverName());
            order.setReceiverAddress(req.getReceiverAddress());
            order.setReceiverPhone(req.getReceiverPhone());
            order.setStatus(OrderStatus.PENDING); // enum: PENDING, CONFIRMED,...

            List<OrderDetail> orderItems = new ArrayList<>();

            for (OrderItemRequest itemReq : entry.getValue()) {
                Long productId = itemReq.getProductId();
                Product product = this.productRepository.findByIdAndShopId(productId, shopId)
                        .orElseThrow(() -> {
                            log.error("Product with id {} not found in shop {}", productId, shopId);
                            return new AppException(
                                    HttpStatus.NOT_FOUND.value(),
                                    "Product not found",
                                    "Không tìm thấy sản phẩm trong cửa hàng");
                        });

                // Kiểm tra tồn kho (nếu có)
                if (product.getStock() < itemReq.getQuantity()) {
                    throw new AppException(HttpStatus.BAD_REQUEST.value(),
                            "Product " + product.getName()
                                    + " does not have enough quantity",
                            "Sản phẩm " + product.getName() + " không đúng số lượng");
                }

                OrderDetail item = new OrderDetail();
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity(itemReq.getQuantity());
                item.setPrice(product.getPrice());

                orderItems.add(item);

                // Giảm tồn kho
                product.setStock(product.getStock() - itemReq.getQuantity());
                productRepository.save(product);
            }

            order.setOrderDetail(orderItems);
            order.setOrderDetail(orderItems);

            this.orderRepository.save(order);
            this.orderDetailRepository.saveAll(orderItems);

            log.info("Order created successfully: {}", order.getId());

            Cart cartUser = this.cartRepository.findByUserId(userId).orElse(null);
            if (cartUser != null) {
                List<Long> orderedProductIds = req.getItems()
                        .stream()
                        .map(OrderItemRequest::getProductId)
                        .toList();

                this.cartDetailRepository.deleteByCartIdAndProductIdIn(cartUser.getId(), orderedProductIds);

            }
        }

    }

    @Override
    public Page<OrderProjection> getOrdersListByUser(Pageable pageable) {
        long userId = SecurityUtils.getCurrentUserId();
        return this.orderCustomRepo.findAll(OrderSpecification.hasUserId(
                userId), pageable,
                OrderProjection.class);
    }

    @Override
    public void cancelOrder(UpdateOrderDTO req) {
        long userId = SecurityUtils.getCurrentUserId();
        Order order = this.orderRepository.findOne(OrderSpecification.hasIdAndUser(req.getOrderId(), userId))
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND.value(), "Order not found",
                                "Order witdh id" + req.getOrderId() + " not found"));

        if (!order.getStatus().canCancel()) {
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Order can't be canceled", "Order không được hủy");

        }
        order.setStatus(OrderStatus.CANCELED);
        this.orderRepository.save(order);
    }

}
