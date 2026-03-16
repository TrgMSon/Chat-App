package com.example.chatapp.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.model.Message;

import jakarta.transaction.Transactional;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
    @Query(value = """
            SELECT m.* FROM message AS m
            WHERE m.room_id = ?1
            """, nativeQuery=true)
    ArrayList<Message> findMessagesByRoom(String roomId);

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO message(user_id, room_id, content, created_at, type) VALUES(?1, ?2, ?3, ?4, ?5) 
            """, nativeQuery=true)
    void saveMessage(String userId, String roomId, String content, LocalDateTime createdAt, String type);
}
