package com.example.chatapp.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.chatapp.model.Message;

import jakarta.transaction.Transactional;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
        @Query("SELECT m FROM Message m WHERE m.room.roomId = :roomId")
        Page<Message> findMessagesByRoom(@Param("roomId") String roomId, Pageable pageable);

        @Transactional
        @Modifying
        @Query(value = """
                        INSERT INTO message(user_id, room_id, content, created_at, type, file_name) VALUES(?1, ?2, ?3, ?4, ?5, ?6)
                        """, nativeQuery = true)
        void saveMessage(String userId, String roomId, String content, LocalDateTime createdAt, String type, String fileName);
}
