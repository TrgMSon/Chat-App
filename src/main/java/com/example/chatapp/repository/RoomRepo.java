package com.example.chatapp.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.dto.RoomMemberDTO2;
import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.Room;
import com.example.chatapp.model.RoomMember;

import jakarta.transaction.Transactional;

@Repository
public interface RoomRepo extends JpaRepository<Room, String> {
        @Query(value = """
                        SELECT rm.* FROM room_member AS rm
                               JOIN room AS r ON r.room_id = rm.room_id
                        WHERE rm.user_id = ?1
                        GROUP BY rm.room_id
                        ORDER BY rm.is_read_last_message ASC, r.last_message_date DESC
                                                """, nativeQuery = true)
        ArrayList<RoomMember> getListRoom(String userId);

        @Query(value = """
                        SELECT rm.room_id FROM room_member AS rm WHERE rm.room_name LIKE ?1 AND rm.user_id = ?2
                        """, nativeQuery = true)
        ArrayList<String> findRoomIdByName(String roomName, String userId);

        @Query(value = "SELECT * FROM room WHERE room_id = ?1", nativeQuery = true)
        Room isExistRoom(String roomId);

        @Transactional
        @Modifying
        @Query(value = "INSERT INTO room_member(user_id, room_id, room_name, is_read_last_message) VALUES(?1, ?2, ?3, ?4)", nativeQuery = true)
        void saveRoomMember(String userId, String roomId, String roomName, int isReadLastMessage);

        @Transactional
        @Modifying
        @Query(value = "INSERT INTO room(room_id, type) VALUES(?1, ?2)", nativeQuery = true)
        void saveRoom(String roomId, String type);

        @Query(value = """
                        SELECT rm.user_id, u.user_name, u.bio, u.address FROM room_member AS rm
                        JOIN user AS u ON u.user_id = rm.user_id
                        WHERE room_id=?1
                        """, nativeQuery = true)
        ArrayList<UserDTO2> viewMemberInGroup(String roomId);

        @Transactional
        @Modifying
        @Query(value = """
                        UPDATE room_member rm
                                JOIN room r ON r.room_id = rm.room_id
                                JOIN room_member rm2 ON rm2.room_id = r.room_id
                        SET rm.room_name = ?1
                        WHERE r.type = 'direct'
                                AND rm.user_id <> ?2
                                AND rm2.user_id = ?2;
                            """, nativeQuery = true)
        Integer updateDirectRoomName(String newName, String userId);

        @Query(value = """
                        SELECT rm.user_id, rm.room_id FROM  room_member rm
                                JOIN room r ON r.room_id = rm.room_id
                                JOIN room_member rm2 ON rm2.room_id = r.room_id
                        WHERE r.type = 'direct'
                            AND rm.user_id <> ?1
                            AND rm2.user_id = ?1
                                                """, nativeQuery = true)
        ArrayList<RoomMemberDTO2> findRoomMemberDirect(String userId);

        @Transactional
        @Modifying
        @Query(value = "UPDATE room_member SET is_read_last_message = ?1 WHERE user_id = ?2 AND room_id = ?3", nativeQuery = true)
        void updateSeenLastMessage(int isReadLastMessage, String userId, String roomId);

        @Transactional
        @Modifying
        @Query(value = "UPDATE room_member SET is_read_last_message = ?1 WHERE room_id = ?2", nativeQuery = true)
        void updateNotSeenLastMessage(int isReadLastMessage, String roomId);

        @Transactional
        @Modifying
        @Query(value = "UPDATE room SET last_message_date = ?1 WHERE room_id = ?2", nativeQuery = true)
        void updateLastMessageDate(LocalDateTime lastMessageDate, String roomId);
}
