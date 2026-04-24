package com.example.chatapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;
import java.util.Random;
import java.nio.charset.StandardCharsets;

import com.example.chatapp.dto.UserDTO2;
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

    public User findUserInDirectRoom(String roomId, String userLoginId) {
        return userRepo.findUserInDirectRoom(roomId, userLoginId);
    }

    public void changeStatusUser(String status, String userId) {
        userRepo.changeStatusUser(status, userId);
    }

    public int getQtyUser() {
        return userRepo.getQtyUser();
    }

    public ArrayList<UserDTO2> findAllUser() {
        ArrayList<User> users = userRepo.findAllUser();
        ArrayList<UserDTO2> userDTO2s = new ArrayList<>();
        for (User user : users) {
            userDTO2s.add(new UserDTO2(user.getUserId(), user.getUserName(), user.getBio()));
        }
        return userDTO2s;
    }

    public ArrayList<String> searchUser(String target) {
        return userRepo.findUserByTarget(target, "%" + target + "%");
    }
}
