package com.example.chatapp.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;

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
    private UserService userService;
    private ReportService reportService;
    private RoomService roomService;

    public MainController(UserService userService, ReportService reportService, RoomService roomService) {
        this.userService = userService;
        this.reportService = reportService;
        this.roomService = roomService;
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/login")
    public String checkLogin(@ModelAttribute User user, Model model, HttpSession session) {
        String email = user.getEmail();

        if (email.isEmpty())
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
                    model.addAttribute("error", "Tài khoản của bạn đang bị khóa");
                    return "login";
                }
            } else if (role.equals("admin")) {
                session.setAttribute("userId", user.getUserId());
                return "redirect:/manage";
            }

            return "login";
        }

        model.addAttribute("error", "Email hoặc mật khẩu không đúng, vui lòng thử lại.");
        return "login";
    }

    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

    @PostMapping("/signup")
    public String checkSignup(@ModelAttribute User user, Model model, RedirectAttributes ra) {
        String email = user.getEmail().trim();
        if (email.isEmpty())
            return "redirect:/signup";

        user.setBio(user.getBio().trim());
        user.setEmail(email);
        user.setPassword(user.getPassword().trim());
        user.setUserName(user.getUserName().trim());
        user.setRole("user");
        user.setStatus("allowed");

        if (!userService.saveUser(user)) {
            model.addAttribute("error", "Email đã tồn tại, vui lòng đăng nhập hoặc sử dụng email khác.");
            return "signup";
        }

        ra.addFlashAttribute("message", "Đăng ký tài khoản thành công, vui lòng đăng nhập");
        return "redirect:/login";
    }

    @GetMapping("/manage")
    public String manage(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login";
        }

        User user = userService.findUserById(userId);

        if (!user.getRole().equals("admin")) return "redirect:/login";

        int qtyUser = userService.getQtyUser();
        int qtyReport = reportService.getQtyReport();
        String current_datetime = LocalDateTime.now() + "";
        String labelQtyReport = "Số lượng báo cáo trong tháng " + current_datetime.substring(6, 7) + ": " + qtyReport;
        String labelQtyUser = "Số lượng người dùng: " + qtyUser;
        
        model.addAttribute("qtyUserReport", labelQtyUser);
        model.addAttribute("qtyMonthReport", labelQtyReport);
        model.addAttribute("userName", user.getUserName());

        return "management";
    }

    @GetMapping("/home")
    public String home(Model model, HttpSession session) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login";
        }

        User user = userService.findUserById(userId);
        if (!user.getRole().equals("user")) return "redirect:/login";

        ArrayList<RoomDTO> rooms = roomService.getListRoom(userId);

        model.addAttribute("user", user);
        model.addAttribute("rooms", rooms);
        return "home";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
