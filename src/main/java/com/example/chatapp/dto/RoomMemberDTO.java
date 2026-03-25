package com.example.chatapp.dto;

import java.util.ArrayList;

import lombok.Data;

@Data
public class RoomMemberDTO {
    private String roomName;
    private String userLoginId;
    private ArrayList<String> userIds;

    public RoomMemberDTO(String userLoginId, String roomName, ArrayList<String> userIds) {
        this.roomName = roomName;
        this.userLoginId = userLoginId;
        this.userIds = userIds;
    }
}
