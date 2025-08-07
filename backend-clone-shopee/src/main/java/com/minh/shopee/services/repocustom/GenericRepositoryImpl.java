package com.minh.shopee.services.repocustom;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;

import com.minh.shopee.repository.GenericRepositoryCustom;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TupleElement;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Selection;

public class GenericRepositoryImpl<T> implements GenericRepositoryCustom<T> {

    @PersistenceContext
    private EntityManager entityManager;

    private final Class<T> domainClass;

    private final ProjectionFactory projectionFactory = new SpelAwareProxyProjectionFactory();

    public GenericRepositoryImpl(Class<T> domainClass) {
        this.domainClass = domainClass;
    }

    @Override
    public <R> Optional<R> findOne(Specification<T> spec, Class<R> projection) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        if (projection.isInterface()) {
            CriteriaQuery<Tuple> cq = cb.createTupleQuery();
            Root<T> root = cq.from(domainClass);

            if (spec != null) {
                Predicate predicate = spec.toPredicate(root, cq, cb);
                if (predicate != null)
                    cq.where(predicate);
            }

            List<Selection<?>> selections = new ArrayList<>();
            for (Method method : projection.getMethods()) {
                String methodName = method.getName();
                if (!methodName.startsWith("get") || method.getParameterCount() > 0)
                    continue;
                String field = Character.toLowerCase(methodName.charAt(3)) + methodName.substring(4);
                selections.add(root.get(field).alias(field));
            }

            cq.multiselect(selections);
            TypedQuery<Tuple> query = entityManager.createQuery(cq).setMaxResults(1);
            List<Tuple> result = query.getResultList();

            if (result.isEmpty())
                return Optional.empty();

            Tuple tuple = result.get(0);
            Map<String, Object> values = new HashMap<>();
            for (TupleElement<?> element : tuple.getElements()) {
                values.put(element.getAlias(), tuple.get(element.getAlias()));
            }

            return Optional.of(projectionFactory.createProjection(projection, values));
        } else {
            CriteriaQuery<R> cq = cb.createQuery(projection);
            Root<T> root = cq.from(domainClass);

            if (spec != null) {
                Predicate predicate = spec.toPredicate(root, cq, cb);
                if (predicate != null)
                    cq.where(predicate);
            }

            Constructor<?> constructor = projection.getConstructors()[0];
            Parameter[] parameters = constructor.getParameters();

            List<Selection<?>> selections = new ArrayList<>();
            for (Parameter param : parameters) {
                selections.add(root.get(param.getName())); // hoặc dùng Spring's ParameterNameDiscoverer như đã nói
            }

            cq.select(cb.construct(projection, selections.toArray(new Selection[0])));
            TypedQuery<R> query = entityManager.createQuery(cq).setMaxResults(1);
            List<R> result = query.getResultList();

            return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
        }
    }

    @Override
    public <R> Page<R> findAll(Specification<T> spec, Pageable pageable, Class<R> projection) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        List<R> content;

        if (projection.isInterface()) {
            content = fetchInterfaceProjection(spec, pageable, projection, cb);
        } else {
            content = fetchConstructorProjection(spec, pageable, projection, cb);
        }

        long total = countTotal(spec, cb);

        return new PageImpl<>(content, pageable, total);
    }

    private <R> List<R> fetchConstructorProjection(Specification<T> spec, Pageable pageable, Class<R> projection,
            CriteriaBuilder cb) {
        CriteriaQuery<R> cq = cb.createQuery(projection);
        Root<T> root = cq.from(domainClass);

        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, cq, cb);
            if (predicate != null)
                cq.where(predicate);
        }

        if (projection.equals(domainClass)) {
            @SuppressWarnings("unchecked")
            Selection<? extends R> selection = (Selection<? extends R>) root;
            cq.select(selection);
        } else {
            try {
                Constructor<?> constructor = projection.getConstructors()[0];
                Parameter[] parameters = constructor.getParameters();

                List<Selection<?>> selections = new ArrayList<>();
                for (Parameter param : parameters) {
                    selections.add(root.get(param.getName()));
                }

                cq.select(cb.construct(projection, selections.toArray(new Selection[0])));
            } catch (Exception e) {
                throw new RuntimeException("Failed to build projection constructor query", e);
            }
        }

        if (pageable.getSort().isSorted()) {
            cq.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));
        }

        TypedQuery<R> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        return query.getResultList();
    }

    private <R> List<R> fetchInterfaceProjection(Specification<T> spec, Pageable pageable, Class<R> projection,
            CriteriaBuilder cb) {
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<T> root = cq.from(domainClass);

        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, cq, cb);
            if (predicate != null)
                cq.where(predicate);
        }

        List<Selection<?>> selections = new ArrayList<>();
        Set<String> aliases = new HashSet<>();

        for (Method method : projection.getMethods()) {
            String methodName = method.getName();
            if (!methodName.startsWith("get") || method.getParameterCount() > 0)
                continue;

            String field = Character.toLowerCase(methodName.charAt(3)) + methodName.substring(4); // getName → name
            selections.add(root.get(field).alias(field));
            aliases.add(field);
        }

        cq.multiselect(selections);

        if (pageable.getSort().isSorted()) {
            cq.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));
        }

        TypedQuery<Tuple> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Tuple> tuples = query.getResultList();

        return tuples.stream()
                .map(tuple -> {
                    Map<String, Object> values = new HashMap<>();
                    for (TupleElement<?> element : tuple.getElements()) {
                        String alias = element.getAlias();
                        if (aliases.contains(alias)) {
                            values.put(alias, tuple.get(alias));
                        }
                    }
                    return projectionFactory.createProjection(projection, values);
                })
                .collect(Collectors.toList());
    }

    private long countTotal(Specification<T> spec, CriteriaBuilder cb) {
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<T> root = countQuery.from(domainClass);
        countQuery.select(cb.count(root));

        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, countQuery, cb);
            if (predicate != null)
                countQuery.where(predicate);
        }

        return entityManager.createQuery(countQuery).getSingleResult();
    }
}
