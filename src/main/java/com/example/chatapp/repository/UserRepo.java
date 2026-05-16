package com.example.chatapp.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepo extends JpaRepository<User, String> {
        User findByEmail(String email);

        @Query(value = """
                        SELECT u.user_id, u.user_name, u.bio, u.address FROM user AS u WHERE user_name LIKE ?1
                        AND u.user_id <> ?2 AND EXISTS (SELECT rm1.user_id FROM room_member AS rm1
                                JOIN room_member AS rm2 ON rm1.room_id = rm2.room_id
                                JOIN room AS r ON r.room_id = rm1.room_id
                        WHERE rm1.user_id = ?2 AND rm2.user_id = u.user_id AND r.type = "direct")
                        AND u.role = 'user'
                        """, nativeQuery = true)
        ArrayList<UserDTO2> findChattingUser(String name, String userId);

        @Query(value = """
                        SELECT u.user_id, u.user_name, u.bio, u.address FROM user AS u WHERE user_name LIKE ?1
                        AND u.user_id <> ?2 AND NOT EXISTS (SELECT rm1.user_id FROM room_member AS rm1
                                JOIN room_member AS rm2 ON rm1.room_id = rm2.room_id
                                JOIN room AS r ON r.room_id = rm1.room_id
                        WHERE rm1.user_id = ?2 AND rm2.user_id = u.user_id AND r.type = "direct")
                        AND u.role = 'user'
                                          """, nativeQuery = true)
        ArrayList<UserDTO2> findNewUser(String name, String userId);

        @Query(value = """
                        SELECT u.* FROM user AS u
                        JOIN room_member AS rm ON u.user_id = rm.user_id
                        WHERE rm.room_id=?1 AND u.user_id <> ?2
                        """, nativeQuery = true)
        User findUserInDirectRoom(String roomId, String userLoginId);

        @Query(value = "SELECT user_id FROM user WHERE role='user' AND (user_id=?1 OR user_name LIKE ?2)", nativeQuery = true)
        ArrayList<String> findUserByTarget(String userId, String userName);

        @Query(value = "SELECT COUNT(*) FROM user WHERE role='user'", nativeQuery = true)
        int getQtyUser();

        @Transactional
        @Modifying
        @Query(value = "UPDATE user SET status=?1 WHERE user_id=?2", nativeQuery = true)
        void changeStatusUser(String status, String userId);

        @Query(value = "SELECT * FROM user WHERE role='user' ORDER BY user_name", nativeQuery = true)
        ArrayList<User> findAllUser();

        @Query(value = """
                        SELECT u.user_id, u.user_name, u.bio, u.address FROM user AS u WHERE address LIKE ?1 
                        AND user_id <> ?2 AND role = 'user' 
                        AND NOT EXISTS (SELECT rm1.user_id FROM room_member AS rm1
                                JOIN room_member AS rm2 ON rm1.room_id = rm2.room_id
                                JOIN room AS r ON r.room_id = rm1.room_id
                        WHERE rm1.user_id = ?2 AND rm2.user_id = u.user_id AND r.type = "direct")
                        ORDER BY RAND() LIMIT 5
                        """, nativeQuery = true)
        ArrayList<UserDTO2> findSameAddress(String address, String userLoginId);

        @Query(value = """
                        SELECT u.user_id, u.user_name, u.bio, u.address FROM user AS u WHERE user_id <> ?1 
                        AND role = 'user' AND address <> ?2
                        AND NOT EXISTS (SELECT rm1.user_id FROM room_member AS rm1
                                JOIN room_member AS rm2 ON rm1.room_id = rm2.room_id
                                JOIN room AS r ON r.room_id = rm1.room_id
                        WHERE rm1.user_id = ?1 AND rm2.user_id = u.user_id AND r.type = "direct")
                        ORDER BY RAND() LIMIT 5
                        """, nativeQuery = true)
        ArrayList<UserDTO2> findRandomUser(String userLoginId, String address);
}
