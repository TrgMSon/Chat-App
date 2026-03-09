package com.example.chatapp.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MessageDTO {
    private String userId;
    private String userName;
    private String content;
    private String roomId;
    private LocalDateTime createdAt;

    public MessageDTO(String userId, String roomId, String userName, String content, LocalDateTime createadAt) {
        this.userId = userId;
        this.roomId = roomId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createadAt;
    }
}
