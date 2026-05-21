package com.example.chatapp.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDTO {
    private String roomId;
    private String type;
    private LocalDateTime createdAt;
    private String userId;
    private String roomName;
    private int isReadLastMessage;
}
