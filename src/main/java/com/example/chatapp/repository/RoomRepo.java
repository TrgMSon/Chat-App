package com.example.chatapp.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.Room;
import com.example.chatapp.model.RoomMember;

import jakarta.transaction.Transactional;

@Repository
public interface RoomRepo extends JpaRepository<Room, String> {
    @Query(value = """
            SELECT rm.* FROM room_member AS rm WHERE rm.user_id = ?1 ORDER BY rm.room_name
            """, nativeQuery = true)
    ArrayList<RoomMember> getListRoom(String userId);

    @Query(value = """
            SELECT rm.room_id FROM room_member AS rm WHERE rm.room_name LIKE ?1 AND rm.user_id = ?2
            """, nativeQuery = true)
    ArrayList<String> findRoomIdByName(String roomName, String userId);

    @Query(value = """
            SELECT u.user_id, u.user_name, u.bio FROM user AS u WHERE user_name LIKE ?1
            AND u.user_id <> ?2 AND NOT EXISTS (SELECT rm1.user_id FROM room_member AS rm1
            JOIN room_member AS rm2 ON rm1.room_id = rm2.room_id
            JOIN room AS r ON r.room_id = rm1.room_id
            WHERE rm1.user_id = ?2 AND rm2.user_id = u.user_id AND r.type = "direct")
            AND u.role = 'user'
                              """, nativeQuery = true)
    ArrayList<UserDTO2> findListRoom(String name, String userId);

    @Query(value = "SELECT * FROM room WHERE room_id = ?1", nativeQuery = true)
    Room isExistRoom(String roomId);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO room_member(user_id, room_id, room_name, joined_at) VALUES(?1, ?2, ?3, ?4)", nativeQuery = true)
    void saveRoomMember(String userId, String roomId, String roomName, LocalDateTime joinedAt);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO room(room_id, type, created_at) VALUES(?1, ?2, ?3)", nativeQuery = true)
    void saveRoom(String roomId, String type, LocalDateTime createdAt);

    @Query(value = """
            SELECT rm.user_id, u.user_name, u.bio FROM room_member AS rm
            JOIN user AS u ON u.user_id = rm.user_id
            WHERE room_id=?1
            """, nativeQuery = true)
    ArrayList<UserDTO2> viewMemberInGroup(String roomId);
}
