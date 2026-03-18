package com.example.chatapp.dto;

import java.util.ArrayList;

import lombok.Data;

@Data
public class RoomMemberDTO {
    private String roomName;
    private ArrayList<String> userIds;

    public RoomMemberDTO(String roomName, ArrayList<String> userIds) {
        this.roomName = roomName;
        this.userIds = userIds;
    }
}
