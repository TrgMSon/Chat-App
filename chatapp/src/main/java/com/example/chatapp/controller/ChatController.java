package com.example.chatapp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.chatapp.model.User;
import com.example.chatapp.service.MessageService;
import com.example.chatapp.service.UserService;
import com.example.chatapp.dto.MessageDTO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ChatController {
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
    public ArrayList<String> searchRoom(@RequestParam String roomName, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.findRoomIdByName(roomName, userId);
    }

    @GetMapping("/addFriendsearch")
    public ArrayList<User> searchToAddFriend(@RequestParam String name, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.findRoomToAF(name, userId);
    }

    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get("uploads");

        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path path = uploadDir.resolve(fileName);

        Files.copy(file.getInputStream(), path);

        return "/uploads/" + fileName;
    }
}