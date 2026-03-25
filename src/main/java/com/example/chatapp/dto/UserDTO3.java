package com.example.chatapp.dto;

import lombok.Data;

@Data
public class UserDTO3 {
    private String userLoginId;
    private String userId1;

    public UserDTO3(String userLoginId, String userId1) {
        this.userLoginId = userLoginId;
        this.userId1 = userId1;
    }
}
