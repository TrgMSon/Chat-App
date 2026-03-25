package com.example.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class RoomDTO4 {
    private String roomId;
    private String roomName;
    private String type;

    public RoomDTO4(String roomId, String roomName, String type) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.type = type;
    }
}
