package com.example.chatapp.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String userId;

    public UserDTO(String userId) {
        this.userId = userId;
    }
}
