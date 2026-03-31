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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.chatapp.model.User;
import com.example.chatapp.service.MessageService;
import com.example.chatapp.service.UserService;
import com.example.chatapp.dto.MessageDTO;
import com.example.chatapp.dto.ReportDTO;
import com.example.chatapp.dto.RoomDTO2;
import com.example.chatapp.dto.UserDTO2;

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
        ArrayList<MessageDTO> messageDTOs = messageService.getMessagesByRoom(roomId, 0);
        return messageDTOs;
    }

    @GetMapping("/getPreMessage")
    public ArrayList<MessageDTO> getPreMess(@RequestParam String roomId, @RequestParam int pageIndex) {
        ArrayList<MessageDTO> messageDTOs = messageService.getMessagesByRoom(roomId, pageIndex * 10);
        return messageDTOs;
    }

    @GetMapping("/getSession")
    public String getSession(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userId;
    }

    @GetMapping("/getUserInfor")
    public User getUserInfor(@RequestParam String userId) {
        return userService.findUserById(userId);
    }

    @GetMapping("/searchRoom")
    public RoomDTO2 searchRoom(@RequestParam String roomName, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return new RoomDTO2(userService.findRoomIdByName(roomName, userId));
    }

    @GetMapping("/addFriendSearch")
    public ArrayList<UserDTO2> searchToAddFriend(@RequestParam String name, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.findRoomToAF(name, userId);
    }

    @GetMapping("/addMemberSearch")
    public ArrayList<UserDTO2> searchToAddMember(@RequestParam String name, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.findChattingUser(name, userId);
    }

    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        // String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        // Path uploadDir = Paths.get("uploads");

        // if (!Files.exists(uploadDir)) {
        //     Files.createDirectories(uploadDir);
        // }

        // Path path = uploadDir.resolve(fileName);

        // Files.copy(file.getInputStream(), path);

        // return "/uploads/" + fileName;

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("url").toString();
    }

    @GetMapping("/viewMember")
    public ArrayList<UserDTO2> viewMember(@RequestParam String roomId) {
        return userService.viewMember(roomId);
    }

    @PostMapping("/sendReport")
    public boolean sendReport(@RequestBody ReportDTO report) {
        return userService.saveReport(report);
    }

    @GetMapping("/viewUserDirectRoom")
    public User findUserInDirectRoom(@RequestParam String roomId, @RequestParam String userLoginId) {
        return userService.findUserInDirectRoom(roomId, userLoginId);
    }
}
