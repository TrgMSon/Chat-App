package com.example.chatapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Room {
    @Id
    @Column(name="room_id", nullable=false)
    private String roomId;

    @Column(nullable=false)
    private String type;

    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt;

    @PrePersist
    void createdAt() {
        createdAt = LocalDateTime.now();
    }
}
