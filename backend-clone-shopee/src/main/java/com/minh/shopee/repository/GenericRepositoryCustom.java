package com.minh.shopee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

/**
 * GenericRepositoryCustom<T>
 *
 * Repository generic cho phép:
 * - Kết hợp Specification (lọc dữ liệu động).
 * - Hỗ trợ Projection (interface projection hoặc constructor projection).
 * - Tối ưu query khi có quan hệ phức tạp (tránh sai paging).
 *
 * ================== LỜI KHUYÊN KHI DÙNG PAGINATION ==================
 * 1. Nếu entity có nhiều quan hệ @OneToMany (ví dụ: Product → Images, Orders),
 * việc join trực tiếp có thể gây ra:
 * - Sai số lượng phần tử trong Page (do bị nhân bản bản ghi).
 * - Giảm hiệu năng vì query join quá nặng.
 *
 * 2. Giải pháp tối ưu: Dùng "Two-step pagination":
 * - Bước 1: Lấy danh sách id bằng findIds(spec, pageable).
 * - Bước 2: Lấy projection chi tiết bằng findAllByIds(ids, projection).
 * - Bước 3: Count riêng bằng repository.count(spec).
 * - Bước 4: Kết hợp lại thành PageImpl.
 *
 * 3. Ưu điểm:
 * - Paging chính xác (không bị trùng record).
 * - Tránh join dư thừa, query gọn nhẹ hơn.
 * - Linh hoạt với Projection (interface hoặc DTO class).
 *
 * 4. Nhược điểm:
 * - Thêm một query phụ để lấy dữ liệu chi tiết theo ids.
 * - Tuy nhiên, thường vẫn nhanh hơn nhiều so với join phức tạp + paging trực
 * tiếp.
 */
public interface GenericRepositoryCustom<T> {

    <R> Page<R> findAll(Specification<T> spec, Pageable pageable, Class<R> projection);

    <R> Optional<R> findOne(Specification<T> spec, Class<R> projection);

    List<Long> findIds(Specification<T> spec, Pageable pageable);

    <R> List<R> findAllByIds(List<Long> ids, Class<R> projection) throws NoSuchMethodException;

}
