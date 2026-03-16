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
    private String type;

    public MessageDTO(String userId, String roomId, String userName, String content, LocalDateTime createadAt, String type) {
        this.userId = userId;
        this.roomId = roomId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createadAt;
        this.type = type;
    }
}
