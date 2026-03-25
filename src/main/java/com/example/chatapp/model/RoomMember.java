package com.example.chatapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="room_member")
@Data
@NoArgsConstructor
public class RoomMember {
    @EmbeddedId
    private RoomMemberId roomMemberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roomId")
    @JoinColumn(name="room_id", nullable=false)
    private Room room;

    @Column(name="room_name", nullable=false)
    private String roomName;

    @Column(name="joined_at", nullable=false)
    private LocalDateTime joinedAt;
}
