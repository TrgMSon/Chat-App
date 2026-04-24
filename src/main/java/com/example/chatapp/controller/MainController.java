package com.example.chatapp.controller;

import java.time.LocalDateTime;
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
import com.example.chatapp.service.ReportService;
import com.example.chatapp.service.RoomService;
import com.example.chatapp.service.UserService;
import com.example.chatapp.dto.RoomDTO;

import jakarta.servlet.http.HttpSession;

@Controller
public class MainController {
    @Autowired
    private UserService userService;

    @Autowired
    private ReportService manageService;

    @Autowired
    private RoomService roomService;
    
    @GetMapping(value = {"/login", "/"})
    public String login() {
        return "login";
    }

    @PostMapping(value = {"/login", "/"})
    public String checkLogin(@ModelAttribute User user, RedirectAttributes ra, HttpSession session) {
        String email = user.getEmail();

        if (email.equals(""))
            return "redirect:/login";

        if (userService.authUser(user)) {
            user = userService.findUserByEmail(email);
            
            String role = user.getRole();
            String status = user.getStatus();
            if (role.equals("user")) {
                if (status.equals("allowed")) {
                    session.setAttribute("userId", user.getUserId());
                    return "redirect:/home";
                }
                else {
                    ra.addFlashAttribute("error", "Tài khoản của bạn đang bị khóa");
                    return "redirect:/login";
                }
            }
            else if (role.equals("admin")) {
                session.setAttribute("userId", user.getUserId());
                return "redirect:/manage";
            }

            return "redirect:/login";
        } else {
            ra.addFlashAttribute("error", "Email hoặc mật khẩu không đúng, vui lòng thử lại.");
            return "redirect:/login";
        }
    }

    @GetMapping("/manage")
    public String manage(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login";
        }

        User user = userService.findUserById(userId);

        if (user.getRole().equals("user")) return "redirect:/login";

        int qtyUser = userService.getQtyUser();
        int qtyReport = manageService.getQtyReport();
        String current_datetime = LocalDateTime.now() + "";
        String labelQtyReport = "Số lượng báo cáo trong tháng " + current_datetime.substring(6, 7) + ": " + qtyReport;
        String labelQtyUser = "Số lượng người dùng: " + qtyUser;
        
        model.addAttribute("qtyUserReport", labelQtyUser);
        model.addAttribute("qtyMonthReport", labelQtyReport);
        model.addAttribute("userName", user.getUserName());

        return "management";
    }

    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

    @PostMapping("/signup")
    public String checkSignup(@ModelAttribute User user, Model model, @RequestParam String action, RedirectAttributes ra) {
        if (action.equals("register")) {
            String email = user.getEmail().trim();

            if (email.equals(""))
                return "redirect:/signup";

            user.setBio(user.getBio().trim());
            user.setEmail(email);
            user.setPassword(user.getPassword().trim());
            user.setUserName(user.getUserName().trim());
            user.setRole("user");
            user.setStatus("allowed");

            if (userService.saveUser(user)) {
                ra.addFlashAttribute("message", "Đăng ký tài khoản thành công");
                return "redirect:/login";
            } else {
                ra.addFlashAttribute("error", "Tài khoản đã tồn tại, vui lòng thử lại.");
                return "redirect:/signup";
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

        ArrayList<RoomDTO> rooms = roomService.getListRoom(userId);
        User user = (User) userService.findUserById(userId);

        model.addAttribute("user", user);
        model.addAttribute("rooms", rooms);
        return "home";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String doLogout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
