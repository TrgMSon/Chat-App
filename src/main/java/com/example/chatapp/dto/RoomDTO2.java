package com.example.chatapp.dto;

import java.util.ArrayList;

import lombok.Data;

@Data
public class RoomDTO2 {
    private ArrayList<String> roomIds;

    public RoomDTO2(ArrayList<String> roomIds) {
        this.roomIds = roomIds;
    }
}
