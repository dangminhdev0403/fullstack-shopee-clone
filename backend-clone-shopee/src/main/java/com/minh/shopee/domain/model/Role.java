package com.minh.shopee.domain.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minh.shopee.domain.base.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@SuperBuilder
@Entity
@NoArgsConstructor
@Table(name = "roles")
public class Role extends BaseEntity {
    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private List<User> users;

    @ManyToMany
    @JoinTable(name = "role_has_permission", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
    @JsonIgnore
    private List<Permission> permissions;
}
