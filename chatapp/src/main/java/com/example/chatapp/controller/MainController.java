package com.example.chatapp.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.chatapp.model.User;
import com.example.chatapp.service.UserService;
import com.example.chatapp.dto.RoomDTO;

import jakarta.servlet.http.HttpSession;

@Controller
public class MainController {
    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @PostMapping("/login")
    public String checkLogin(@ModelAttribute User user, RedirectAttributes ra, HttpSession session) {
        String email = user.getEmail();

        if (email.equals(""))
            return "redirect:/login";

        if (userService.authUser(user)) {
            user = userService.findUserByEmail(email);
            session.setAttribute("userId", user.getUserId());
            
            String role = user.getRole();
            String status = user.getStatus();
            if (role.equals("user")) {
                if (status.equals("allowed")) return "redirect:/home";
                else {
                    ra.addAttribute("message", "Tài khoản của bạn đang bị khóa");
                    return "redirect:/login";
                }
            }
            else if (role.equals("admin")) {
                return "redirect:/manage";
            }

            return "redirect:/login";
        } else {
            ra.addFlashAttribute("message", "Email hoặc mật khẩu không đúng, vui lòng thử lại.");
            return "redirect:/login";
        }
    }

    @GetMapping("/manage")
    public String manage(HttpSession session) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login";
        }
        return "management";
    }

    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

    @PostMapping("/signup")
    public String checkSignup(@ModelAttribute User user, Model model, @RequestParam String action) {
        if (action.equals("register")) {
            String email = user.getEmail();

            if (email.equals(""))
                return "redirect:/signup";

            user.setRole("user");
            user.setStatus("allowed");

            if (userService.saveUser(user)) {
                return "redirect:/login";
            } else {
                model.addAttribute("message", "Tài khoản đã tồn tại, vui lòng thử lại.");
                return "signup";
            }
        }
        return "redirect:/login";
    }

    @GetMapping("/home")
    public String home(Model model, HttpSession session) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login";
        }

        ArrayList<RoomDTO> rooms = userService.getListRoom(userId);
        User user = (User) userService.findUserById(userId);

        model.addAttribute("user", user);
        model.addAttribute("rooms", rooms);
        return "home";
    }

    @PostMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }
}
