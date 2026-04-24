package com.example.chatapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chatapp.dto.ReportDTO2;
import com.example.chatapp.dto.UserDTO2;
import com.example.chatapp.model.Report;
import com.example.chatapp.model.User;
import com.example.chatapp.repository.ReportRepo;
import com.example.chatapp.repository.UserRepo;

@Service
public class ManageService {
    @Autowired
    private ReportRepo reportRepo;

    @Autowired
    private UserRepo userRepo;

    public ArrayList<ReportDTO2> getAllReports() {
        ArrayList<Report> reports = reportRepo.getAllReports();
        ArrayList<ReportDTO2> reportDTO2s = new ArrayList<>();
        for (Report report : reports) {
            reportDTO2s.add(new ReportDTO2(report.getReportId(), report.getUserSend().getUserId(), report.getUserSend().getUserName(), report.getReportedUserId(), report.getContent(), report.getCreatedAt()));
        }
        return reportDTO2s;
    }

    public int getQtyReport() {
        String month = ("" + LocalDateTime.now()).substring(0, 7);
        return reportRepo.getQtyReport("%" + month + "%");
    }

    public int getQtyUser() {
        return userRepo.getQtyUser();
    }

    public ReportDTO2 findReportById(int reportId) {
        Report report = reportRepo.findReportById(reportId);
        return new ReportDTO2(report.getReportId(), report.getUserSend().getUserId(), report.getUserSend().getUserName(), report.getReportedUserId(), report.getContent(), report.getCreatedAt());
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

    public ArrayList<String> searchReport(String target) {
        String[] tmp = target.split("/");
        LocalDateTime start = LocalDateTime.of(Integer.parseInt(tmp[2]), Integer.parseInt(tmp[1]), Integer.parseInt(tmp[0]), 0, 0);
        LocalDateTime end = start.plusDays(1);
        ArrayList<Integer> results = reportRepo.findReportByCreatedAt(start, end);

        ArrayList<String> reportIds = new ArrayList<>();
        for (Integer i : results) {
            reportIds.add(i + "");
        }
        return reportIds;
    }

    public void changeStatusUser(String status, String userId) {
        userRepo.changeStatusUser(status, userId);
    }
}
