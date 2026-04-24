package com.example.chatapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;
import java.util.Random;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import com.example.chatapp.dto.ReportDTO;
import com.example.chatapp.dto.RoomDTO;
import com.example.chatapp.dto.RoomDTO4;
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

    public ArrayList<UserDTO2> findChattingUser(String name, String userId) {
        return userRepo.findChattingUser("%" + name + "%", userId);
    }

    public boolean saveReport(ReportDTO report) {
        int rows = userRepo.saveReport(report.getUserIdSend(), report.getReportedUserId(), report.getContent(), LocalDateTime.now());
        return rows > 0;
    }

    public User findUserInDirectRoom(String roomId, String userLoginId) {
        return userRepo.findUserInDirectRoom(roomId, userLoginId);
    }
}
