package com.example.chatapp.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatapp.model.User;
import com.example.chatapp.service.ReportService;
import com.example.chatapp.service.MessageService;
import com.example.chatapp.service.RoomService;
import com.example.chatapp.service.UserService;
import com.cloudinary.Cloudinary;
import com.example.chatapp.dto.MessageDTO;
import com.example.chatapp.dto.ReportDTO;
import com.example.chatapp.dto.RoomDTO2;
import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.dto.UserDTO5;
import com.example.chatapp.dto.RoomDTO5;
import com.example.chatapp.dto.RoomMemberDTO2;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ChatController {
    private MessageService messageService;
    private Cloudinary cloudinary;
    private UserService userService;
    private RoomService roomService;
    private ReportService reportService;

    public ChatController(MessageService messageService, Cloudinary cloudinary, UserService userService, RoomService roomService, ReportService reportService) {
        this.messageService = messageService;
        this.cloudinary = cloudinary;
        this.userService = userService;
        this.roomService = roomService;
        this.reportService = reportService;
    }

    @GetMapping("/getMessages")
    public List<MessageDTO> getMessages(@RequestParam String roomId) {
        List<MessageDTO> messageDTOs = messageService.getMessagesByRoom(roomId, 0);
        return messageDTOs;
    }

    @GetMapping("/getPreMessage")
    public List<MessageDTO> getPreMess(@RequestParam String roomId, @RequestParam int pageIndex) {
        List<MessageDTO> messageDTOs = messageService.getMessagesByRoom(roomId, pageIndex);
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
        return new RoomDTO2(roomService.findRoomIdByName(roomName, userId));
    }

    @GetMapping("/addFriendSearch")
    public ArrayList<UserDTO2> searchToAddFriend(@RequestParam String name, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.findUserToAF(name, userId);
    }

    @GetMapping("/addMemberSearch")
    public ArrayList<UserDTO2> searchToAddMember(@RequestParam String name, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.findChattingUser(name, userId);
    }

    @GetMapping("/generate-signature")
    public Map<String, Object> generateSignature() {
        long timestamp = System.currentTimeMillis() / 1000;
        Map<String, Object> params = new HashMap<>();
        params.put("timestamp", timestamp);

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret, 1);

        Map<String, Object> response = new HashMap<>();
        response.put("signature", signature);
        response.put("timestamp", timestamp);
        response.put("api_key", cloudinary.config.apiKey);
        response.put("cloud_name", cloudinary.config.cloudName);
        return response;
    }

    @GetMapping("/generate-url-dowload-pdf")
    public Map<String, String> generateDownloadUrl(@RequestParam String publicId) throws Exception {
        Map<String, Object> options = new HashMap<>();

        options.put("resource_type", "image");
        options.put("type", "upload");
        options.put("attachment", true);

        String url = cloudinary.privateDownload(publicId, "pdf", options);

        return Map.of("downloadUrl", url);
    }

    @GetMapping("/viewMember")
    public ArrayList<UserDTO2> viewMember(@RequestParam String roomId) {
        return roomService.viewMember(roomId);
    }

    @PostMapping("/sendReport")
    public boolean sendReport(@RequestBody ReportDTO report) {
        return reportService.saveReport(report);
    }

    @GetMapping("/viewUserDirectRoom")
    public User findUserInDirectRoom(@RequestParam String roomId, @RequestParam String userLoginId) {
        return userService.findUserInDirectRoom(roomId, userLoginId);
    }

    @GetMapping("/getRecommendUsers")
    public ArrayList<UserDTO2> getRecommendUsers(@RequestParam String address, @RequestParam String userLoginId) {
        return userService.findRecommendUsers(address, userLoginId);
    }
    
    @PostMapping("/updateUserInfor")
    public boolean updateUserInfor(@RequestBody UserDTO5 userInfor, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        return userService.updateUserInfor(userInfor, userId);
    }

    @PostMapping("/updateDirectRoomName")
    public boolean updateDirectRoomName(@RequestBody RoomDTO5 roomInfor) {
        return roomService.updateDirectRoomName(roomInfor.getNewName(), roomInfor.getUserId());
    }

    @PostMapping("/hasSeenLastMessage")
    public void updateSeenLastMessage(@RequestBody RoomMemberDTO2 roomMemberDTO2) {
        roomService.updateSeenLastMessage(roomMemberDTO2.getUserId(), roomMemberDTO2.getRoomId(), 1);
    }

    @PostMapping("/notSeenLastMessage")
    public void updateNotSeenLastMessage(@RequestBody RoomMemberDTO2 roomMemberDTO2) {
        roomService.updateNotSeenLastMessage(roomMemberDTO2.getUserId(), roomMemberDTO2.getRoomId(), 0);
    }
}
