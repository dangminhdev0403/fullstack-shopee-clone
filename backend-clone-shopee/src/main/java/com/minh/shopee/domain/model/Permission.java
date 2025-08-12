package com.minh.shopee.domain.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "permissions") // Sửa lỗi đánh máy
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String method;
    private String path;

    private String descrition;

    public Permission(String descrition, String method, String path) {
        this.method = method;
        this.path = path;
        this.descrition = descrition;

    }

    @ManyToMany(mappedBy = "permissions", cascade = { CascadeType.MERGE,
            CascadeType.PERSIST })
    @JsonIgnore

    private Set<Role> roles;

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
