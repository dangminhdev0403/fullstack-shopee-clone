package com.minh.shopee.services.repocustom;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;

import com.minh.shopee.repository.GenericRepositoryCustom;

import jakarta.persistence.*;
import jakarta.persistence.criteria.*;

/**
 * GenericRepositoryImpl
 * - Implement GenericRepositoryCustom<T> để custom query hỗ trợ cả projection +
 * specification
 * - Hỗ trợ cả interface projection và constructor projection
 */
public class GenericRepositoryImpl<T> implements GenericRepositoryCustom<T> {

    @PersistenceContext
    private EntityManager entityManager; // EntityManager để thao tác trực tiếp Criteria API

    private final Class<T> domainClass; // Entity class (vd: Product.class)
    private final ProjectionFactory projectionFactory = new SpelAwareProxyProjectionFactory(); // Tạo projection
                                                                                               // interface từ Map
                                                                                               // values
    private final ParameterNameDiscoverer paramNameDiscoverer = new DefaultParameterNameDiscoverer(); // Lấy tên tham số
                                                                                                      // của constructor

    // Constructor bắt buộc truyền class entity
    public GenericRepositoryImpl(Class<T> domainClass) {
        this.domainClass = domainClass;
    }

    /**
     * Tìm 1 record (Optional) theo Specification và Projection
     * Nếu projection là interface → fetchInterfaceProjection
     * Nếu projection là class (constructor) → fetchConstructorProjection
     */
    @Override
    public <R> Optional<R> findOne(Specification<T> spec, Class<R> projection) {
        List<R> result = projection.isInterface()
                ? fetchInterfaceProjection(spec, Pageable.unpaged(), projection, true)
                : fetchConstructorProjection(spec, Pageable.unpaged(), projection, true);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    /**
     * Tìm nhiều record (Page) theo Specification và Projection
     */
    @Override
    public <R> Page<R> findAll(Specification<T> spec, Pageable pageable, Class<R> projection) {
        // Lấy danh sách content
        List<R> content = projection.isInterface()
                ? fetchInterfaceProjection(spec, pageable, projection, false)
                : fetchConstructorProjection(spec, pageable, projection, false);

        // Tính total count
        long total = pageable.isUnpaged() || content.size() == pageable.getPageSize()
                ? countTotal(spec) // Nếu unpaged hoặc full page size → đếm thật
                : pageable.getOffset() + content.size(); // Ngược lại tính tạm

        return new PageImpl<>(content, pageable, total);
    }

    /**
     * Lấy dữ liệu theo dạng Constructor Projection
     * (Tức là projection là class có constructor phù hợp với field select)
     */
    private <R> List<R> fetchConstructorProjection(Specification<T> spec, Pageable pageable, Class<R> projection,
            boolean singleResult) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<R> cq = cb.createQuery(projection);
        Root<T> root = cq.from(domainClass);

        applySpec(spec, cb, cq, root); // áp dụng điều kiện Specification

        if (projection.equals(domainClass)) {
            // Nếu projection = entity class → select root (lấy nguyên entity)
            @SuppressWarnings("unchecked")
            Selection<? extends R> selection = (Selection<? extends R>) root;
            cq.select(selection);
        } else {
            // Lấy constructor đầu tiên của projection
            Constructor<?> constructor = projection.getConstructors()[0];
            // Lấy tên tham số constructor (vd: id, name)
            String[] paramNames = paramNameDiscoverer.getParameterNames(constructor);

            List<Selection<?>> selections = new ArrayList<>();
            for (String name : paramNames) {
                // Mỗi paramName → mapping sang Path entity (vd: "category.name" →
                // root.get("category").get("name"))
                selections.add(resolvePath(root, name));
            }
            // Tạo select construct
            cq.select(cb.construct(projection, selections.toArray(new Selection[0])));
        }

        applySort(pageable, cb, cq, root); // sắp xếp
        TypedQuery<R> query = entityManager.createQuery(cq);
        applyPaging(query, pageable, singleResult); // phân trang hoặc limit 1
        return query.getResultList();
    }

    /**
     * Lấy dữ liệu theo dạng Interface Projection
     * (Tức là projection là interface có getter tương ứng với field select)
     */
    private <R> List<R> fetchInterfaceProjection(Specification<T> spec, Pageable pageable, Class<R> projection,
            boolean singleResult) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery(); // Trả về Tuple
        Root<T> root = cq.from(domainClass);

        applySpec(spec, cb, cq, root); // áp dụng Specification

        List<Selection<?>> selections = new ArrayList<>();
        Set<String> aliases = new HashSet<>();

        // Duyệt tất cả getter của projection interface
        for (Method method : projection.getMethods()) {
            if (!method.getName().startsWith("get") || method.getParameterCount() > 0)
                continue;

            // Lấy tên field từ getter (vd: getName → "name")
            String field = Character.toLowerCase(method.getName().charAt(3)) + method.getName().substring(4);
            // alias để tránh conflict dấu chấm
            Selection<?> selection = resolvePath(root, field).alias(field.replace(".", "_"));
            selections.add(selection);
            aliases.add(field.replace(".", "_"));
        }

        cq.multiselect(selections);
        applySort(pageable, cb, cq, root);

        TypedQuery<Tuple> query = entityManager.createQuery(cq);
        applyPaging(query, pageable, singleResult);

        List<Tuple> tuples = query.getResultList();
        return tuples.stream()
                .map(tuple -> {
                    Map<String, Object> values = new HashMap<>();
                    for (TupleElement<?> element : tuple.getElements()) {
                        String alias = element.getAlias();
                        if (aliases.contains(alias)) {
                            // Đổi alias _ thành . để mapping đúng nested property
                            values.put(alias.replace("_", "."), tuple.get(alias));
                        }
                    }
                    // projectionFactory map values → projection interface
                    return projectionFactory.createProjection(projection, values);
                })
                .collect(Collectors.toList());
    }

    /**
     * Chuyển "category.name" thành root.get("category").get("name")
     */
    private Path<?> resolvePath(Root<T> root, String field) {
        String[] parts = field.split("\\.");
        Path<?> path = root.get(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            path = path.get(parts[i]);
        }
        return path;
    }

    /**
     * Áp dụng điều kiện Specification
     */
    private void applySpec(Specification<T> spec, CriteriaBuilder cb, CriteriaQuery<?> cq, Root<T> root) {
        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, cq, cb);
            if (predicate != null)
                cq.where(predicate);
        }
    }

    /**
     * Áp dụng sort từ Pageable
     */
    private void applySort(Pageable pageable, CriteriaBuilder cb, CriteriaQuery<?> cq, Root<T> root) {
        if (pageable.getSort().isSorted()) {
            cq.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));
        }
    }

    /**
     * Áp dụng phân trang hoặc limit 1 record
     */
    private void applyPaging(TypedQuery<?> query, Pageable pageable, boolean singleResult) {
        if (singleResult) {
            query.setMaxResults(1);
        } else if (pageable.isPaged()) {
            query.setFirstResult((int) pageable.getOffset());
            query.setMaxResults(pageable.getPageSize());
        }
    }

    /**
     * Đếm tổng record theo Specification
     */
    private long countTotal(Specification<T> spec) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<T> root = countQuery.from(domainClass);
        countQuery.select(cb.count(root));
        applySpec(spec, cb, countQuery, root);
        return entityManager.createQuery(countQuery).getSingleResult();
    }
}
