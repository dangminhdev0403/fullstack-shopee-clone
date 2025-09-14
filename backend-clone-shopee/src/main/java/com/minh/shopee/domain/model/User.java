package com.minh.shopee.domain.model;

import java.util.List;
import java.util.Set;

import com.minh.shopee.domain.base.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@Table(name = "users")
@Entity
@AllArgsConstructor
@NoArgsConstructor

public class User extends BaseEntity {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @Column(columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(columnDefinition = "LONGTEXT")
    private String refreshToken;

    @OneToOne(mappedBy = "user")
    private Cart cart;

    @OneToOne(mappedBy = "owner", cascade = CascadeType.ALL)
    private Shop shop;

    @OneToMany(mappedBy = "user")
    private List<Address> addresses;

    @ManyToMany
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @PrePersist
    public void assignDefaultRole() {
        if (roles == null || roles.isEmpty()) {
            Role defaultRole = new Role();
            defaultRole.setId(3L); // chỉ cần set id, JPA sẽ map đúng
            this.roles = Set.of(defaultRole);
        }
    }

}
