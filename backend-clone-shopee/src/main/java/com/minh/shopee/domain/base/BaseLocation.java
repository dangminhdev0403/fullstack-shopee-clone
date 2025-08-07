package com.minh.shopee.domain.base;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@MappedSuperclass
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class BaseLocation {
    private static final java.util.Random RANDOM = new java.util.Random();

    @Id
    private Long id;
    @NotBlank(message = "Name is required")
    private String name;

    @PrePersist
    public void generateId() {
        if (id == null) {
            long timestamp = System.currentTimeMillis();
            long randomPart = Math.abs(RANDOM.nextLong() % 1000);

            this.id = timestamp * 1000 + randomPart;

        }
    }
}
