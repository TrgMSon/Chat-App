package com.example.chatapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;
import java.util.Random;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import com.example.chatapp.dto.RoomDTO;
import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.Room;
import com.example.chatapp.model.RoomMember;
import com.example.chatapp.model.RoomMemberId;
import com.example.chatapp.model.User;
import com.example.chatapp.repository.UserRepo;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    public boolean saveUser(User user) {
        String email = user.getEmail().trim();

        if (email.equals(""))
            return false;

        if (userRepo.findByEmail(email) == null) {
            Random rand = new Random();
            int tmp = rand.nextInt(1, 9990);
            String userId = "U" + String.format("%04d", tmp);
            
            while (userRepo.findById(userId).isEmpty() == false) {
                tmp = rand.nextInt(1, 9990);
                userId = "U" + String.format("%04d", tmp);
            }
            user.setUserId(userId);

            String pass = user.getPassword();
            String encodePass = Base64.getEncoder().encodeToString(pass.getBytes(StandardCharsets.UTF_8));
            user.setPassword(encodePass);

            user.setEmail(email);
            user.setUserName(user.getUserName().trim());

            userRepo.save(user);
            return true;
        }

        return false;
    }

    public boolean authUser(User user) {
        String email = user.getEmail().trim();

        if (email.equals(""))
            return false;

        User result = userRepo.findByEmail(email);
        if (result == null)
            return false;

        String encodeResultPass = Base64.getEncoder()
                .encodeToString(user.getPassword().getBytes(StandardCharsets.UTF_8));

        if (result.getEmail().equals(email) && result.getPassword().equals(encodeResultPass))
            return true;
        return false;
    }

    public ArrayList<RoomDTO> getListRoom(String userId) {
        ArrayList<RoomMember> rooms = userRepo.getListRoom(userId);
        ArrayList<RoomDTO> roomDTOs = new ArrayList<>();
        for (RoomMember room : rooms) {
            roomDTOs.add(new RoomDTO(room.getRoom().getRoomId(), room.getRoom().getType(),
                    room.getRoom().getCreatedAt(), room.getUser().getUserId(), room.getRoomName(), room.getJoinedAt()));
        }
        return roomDTOs;
    }

    public User findUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public User findUserById(String userId) {
        if (userId == null)
            return null;

        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isEmpty())
            return null;
        return optionalUser.get();
    }

    public ArrayList<String> findRoomIdByName(String roomName, String userId) {
        return userRepo.findRoomIdByName(roomName, userId);
    }

    public ArrayList<UserDTO2> findRoomToAF(String name, String userId) {
        return userRepo.findListRoom(name, userId);
    }

    public ArrayList<UserDTO2> findChattingUser(String name, String userId) {
        return userRepo.findChattingUser(name, userId);
    }

    public Room createRoom(String type) {
        Room room = new Room();

        Random rand = new Random();
        int tmp = rand.nextInt(1, 9990);
        String roomId = "R" + String.format("%04d", tmp);

        while (userRepo.isExistRoom(roomId) != null) {
            tmp = rand.nextInt(1, 9990);
            roomId = "R" + String.format("%04d", tmp);
        }
        room.setRoomId(roomId);
        room.setType(type);
        room.setCreatedAt(LocalDateTime.now());

        userRepo.saveRoom(room.getRoomId(), room.getType(), room.getCreatedAt());
        
        return room;
    }

    public void createDirectRoomMember(String userId, String userId1, Room room) {
        Optional<User> user = userRepo.findById(userId);
        Optional<User> user1 = userRepo.findById(userId1);

        RoomMemberId rmId = new RoomMemberId();
        rmId.setUserId(userId);
        rmId.setRoomId(room.getRoomId());
        RoomMember rm = new RoomMember();

        rm.setRoomMemberId(rmId);
        rm.setRoom(room);
        rm.setUser(user.get());
        rm.setRoomName(user1.get().getUserName());
        rm.setJoinedAt(room.getCreatedAt());

        userRepo.saveRoomMember(rm.getUser().getUserId(), rm.getRoom().getRoomId(), rm.getRoomName(), rm.getJoinedAt());
    }

    public void createGroupMember(String userId, Room room, String roomName) {
        Optional<User> user = userRepo.findById(userId);

        RoomMemberId rmId = new RoomMemberId();
        rmId.setUserId(userId);
        rmId.setRoomId(room.getRoomId());
        RoomMember rm = new RoomMember();

        rm.setRoomMemberId(rmId);
        rm.setRoom(room);
        rm.setUser(user.get());
        rm.setRoomName(roomName);
        rm.setJoinedAt(room.getCreatedAt());

        userRepo.saveRoomMember(rm.getUser().getUserId(), rm.getRoom().getRoomId(), rm.getRoomName(), rm.getJoinedAt());
    }
}
