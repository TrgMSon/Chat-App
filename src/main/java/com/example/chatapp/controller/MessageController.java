package com.example.chatapp.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatapp.model.User;
import com.example.chatapp.service.MessageService;
import com.example.chatapp.service.UserService;
import com.example.chatapp.dto.MessageDTO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;
    
    @GetMapping("/getMessages")
    public ArrayList<MessageDTO> getMessages(@RequestParam String roomId) {
        ArrayList<MessageDTO> messageDTOs = messageService.getMessagesByRoom(roomId);
        return messageDTOs;
    }

    @GetMapping("/getSession")
    public String getSession(HttpSession session) {
        return (String) session.getAttribute("userId");
    }

    @GetMapping("/getUserInfor")
    public User getUserInfor(@RequestParam String userId) {
        return userService.findUserById(userId);
    }

    @GetMapping("/searchRoom")
    public ArrayList<String> searchRoom(@RequestParam String roomName) {
        return userService.findRoomIdByName(roomName);
    }

    @PostMapping("/saveMessage")
    public MessageDTO saveMessage(@RequestBody MessageDTO message) {
        messageService.saveMessage(message);
        return message;
    }
}