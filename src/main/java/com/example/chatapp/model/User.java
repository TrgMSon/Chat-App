package com.example.chatapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class User {
    @Id
    @Column(name="user_id", nullable=false)
    private String userId;

    @Column(name="user_name", nullable=false)
    private String userName;

    @Column(nullable=false)
    private String password;

    @Column(nullable=true)
    private String bio;

    @Column(nullable=false)
    private String email;

    @Column(nullable=false)
    private String status;

    @Column(nullable=false)
    private String role;
}
