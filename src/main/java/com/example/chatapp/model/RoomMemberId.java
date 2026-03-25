package com.example.chatapp.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.NoArgsConstructor;
import lombok.Data;

@Embeddable
@Data
@NoArgsConstructor
public class RoomMemberId implements Serializable {
    @Column(name="user_id", nullable=false)
    private String userId;

    @Column(name="room_id", nullable=false)
    private String roomId;
}
