package com.example.chatapp.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.chatapp.dto.ReportDTO2;
import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.User;
import com.example.chatapp.service.ManageService;
import com.example.chatapp.service.UserService;

@RestController
@RequestMapping("/api/manage")
public class ManageController {
    @Autowired
    private ManageService manageService;

    @Autowired
    private UserService userService;

    @GetMapping("/getReports")
    public ArrayList<ReportDTO2> getAllReports() {
        return manageService.getAllReports();
    }

    @GetMapping("/viewReportDetail")
    public ReportDTO2 viewReport(@RequestParam int reportId) {
        return manageService.findReportById(reportId);
    }

    @GetMapping("/getUsers")
    public ArrayList<UserDTO2> getAllUsers() {
        return manageService.findAllUser();
    }

    @GetMapping("/viewUserDetail")
    public User viewUserDetail(@RequestParam String userId) {
        return userService.findUserById(userId);
    } 

    @GetMapping("/searchUser")
    public ArrayList<String> searchUser(@RequestParam String target) {
        return manageService.searchUser(target);
    }

    @GetMapping("/searchReport")
    public ArrayList<String> searchReport(@RequestParam String target) {
        return manageService.searchReport(target);
    }
    
}