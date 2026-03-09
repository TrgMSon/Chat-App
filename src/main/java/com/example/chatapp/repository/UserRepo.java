package com.example.chatapp.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.model.RoomMember;
import com.example.chatapp.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, String> {
    User findByEmail(String email);
    
    @Query(value = """
            SELECT rm.* FROM room_member AS rm WHERE rm.user_id = ?1
            """, nativeQuery=true)
    ArrayList<RoomMember> getListRoom(String userId);

    @Query(value = """
            SELECT rm.room_id FROM room_member AS rm WHERE rm.room_name LIKE %?1%
            """, nativeQuery=true)
    ArrayList<String> findRoomIdByName(String roomName);
}
