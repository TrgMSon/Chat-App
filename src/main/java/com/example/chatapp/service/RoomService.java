package com.example.chatapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chatapp.dto.RoomDTO;
import com.example.chatapp.dto.RoomDTO4;
import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.Room;
import com.example.chatapp.model.User;
import com.example.chatapp.model.RoomMember;
import com.example.chatapp.model.RoomMemberId;
import com.example.chatapp.repository.RoomRepo;
import com.example.chatapp.repository.UserRepo;

@Service
public class RoomService {
    @Autowired
    private RoomRepo roomRepo;

    @Autowired
    private UserRepo userRepo;

    public ArrayList<RoomDTO> getListRoom(String userId) {
        ArrayList<RoomMember> rooms = roomRepo.getListRoom(userId);
        ArrayList<RoomDTO> roomDTOs = new ArrayList<>();
        for (RoomMember room : rooms) {
            roomDTOs.add(new RoomDTO(room.getRoom().getRoomId(), room.getRoom().getType(),
                    room.getRoom().getCreatedAt(), room.getUser().getUserId(), room.getRoomName(), room.getJoinedAt()));
        }
        return roomDTOs;
    }

    public ArrayList<String> findRoomIdByName(String roomName, String userId) {
        return roomRepo.findRoomIdByName("%" + roomName + "%", userId);
    }

    public ArrayList<UserDTO2> findRoomToAF(String name, String userId) {
        return roomRepo.findListRoom("%" + name + "%", userId);
    }

    public Room createRoom(String type) {
        Room room = new Room();

        Random rand = new Random();
        int tmp = rand.nextInt(1, 9990);
        String roomId = "R" + String.format("%04d", tmp);

        while (roomRepo.isExistRoom(roomId) != null) {
            tmp = rand.nextInt(1, 9990);
            roomId = "R" + String.format("%04d", tmp);
        }
        room.setRoomId(roomId);
        room.setType(type);
        room.setCreatedAt(LocalDateTime.now());

        roomRepo.saveRoom(room.getRoomId(), room.getType(), room.getCreatedAt());
        
        return room;
    }

    public RoomDTO4 createDirectRoomMember(String userId, String userId1, Room room) {
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

        roomRepo.saveRoomMember(rm.getUser().getUserId(), rm.getRoom().getRoomId(), rm.getRoomName(), rm.getJoinedAt());

        return new RoomDTO4(rm.getRoom().getRoomId(), rm.getRoomName(), rm.getRoom().getType());
    }

    public RoomDTO4 createGroupMember(String userId, Room room, String roomName) {
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

        roomRepo.saveRoomMember(rm.getUser().getUserId(), rm.getRoom().getRoomId(), rm.getRoomName(), rm.getJoinedAt());

        return new RoomDTO4(rm.getRoom().getRoomId(), rm.getRoomName(), rm.getRoom().getType());
    }

    public ArrayList<UserDTO2> viewMember(String roomId) {
        return roomRepo.viewMemberInGroup(roomId);
    }
}
