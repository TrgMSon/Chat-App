package com.example.chatapp.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.chatapp.dto.MessageDTO;
import com.example.chatapp.dto.RoomDTO4;
import com.example.chatapp.dto.RoomMemberDTO;
import com.example.chatapp.dto.UserDTO3;
import com.example.chatapp.dto.UserDTO4;
import com.example.chatapp.model.Room;
import com.example.chatapp.service.ManageService;
import com.example.chatapp.service.MessageService;
import com.example.chatapp.service.UserService;

@Controller
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ManageService manageService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(MessageDTO message) {
        message.setCreatedAt(LocalDateTime.now());
        messageService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomId(), message);
    }

    @MessageMapping("/chat.newDirectRoom")
    public void sendNewRoom(UserDTO3 user) {
        String userLoginId = user.getUserLoginId();
        String userId1 = user.getUserId1();

        Room room = userService.createRoom("direct");
        RoomDTO4 roomdto1 = userService.createDirectRoomMember(userId1, userLoginId, room);
        RoomDTO4 roomdto = userService.createDirectRoomMember(userLoginId, userId1, room);

        messagingTemplate.convertAndSendToUser(userLoginId, "/queue/new-room", roomdto);
        messagingTemplate.convertAndSendToUser(userId1, "/queue/new-room", roomdto1);
    }

    @MessageMapping("/chat.newGroup")
    public void sendNewGroup(RoomMemberDTO roomMemberDTO) {
        Room group = userService.createRoom("group");
        String userLoginId = roomMemberDTO.getUserLoginId();

        ArrayList<String> userIds = roomMemberDTO.getUserIds();
        userIds.add(userLoginId);
        for (String userId : userIds) {
            RoomDTO4 roomdto = userService.createGroupMember(userId, group, roomMemberDTO.getRoomName());
            messagingTemplate.convertAndSendToUser(userId, "/queue/new-room", roomdto);
        }
    }

    @MessageMapping("/manage.changeStatusUser")
    public void changeStatusUser(UserDTO4 user) {
        manageService.changeStatusUser(user.getStatus(), user.getUserId());
        messagingTemplate.convertAndSendToUser(user.getUserId(), "/queue/force-logout", user);
    }
}
