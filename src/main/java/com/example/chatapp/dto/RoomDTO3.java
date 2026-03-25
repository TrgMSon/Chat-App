package com.example.chatapp.dto;

import lombok.Data;

@Data
public class RoomDTO3 {
    private String roomId;
    private String roomName;

    public RoomDTO3(String roomId, String roomName) {
        this.roomId = roomId;
        this.roomName = roomName;
    }
}
