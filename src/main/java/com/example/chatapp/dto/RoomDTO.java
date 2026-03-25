package com.example.chatapp.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class RoomDTO {
    private String roomId;
    private String type;
    private LocalDateTime createdAt;
    private String userId;
    private String roomName;
    private LocalDateTime joinedAt;
    
    public RoomDTO(String roomId, String type, LocalDateTime createdAt, String userId, String roomName, LocalDateTime joinedAt) {
        this.roomId = roomId;
        this.type = type;
        this.createdAt = createdAt;
        this.userId = userId;
        this.roomName = roomName;
        this.joinedAt = joinedAt;
    }
}
