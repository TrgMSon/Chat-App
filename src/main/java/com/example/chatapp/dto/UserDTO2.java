package com.example.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO2 {
    private String userId;
    private String userName;
    private String bio;
    private String address;
}
