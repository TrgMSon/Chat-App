package com.example.chatapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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

    @Column(name="last_message_date")
    private LocalDateTime lastMessageDate;
}
