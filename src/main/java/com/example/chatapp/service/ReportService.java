package com.example.chatapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chatapp.dto.ReportDTO;
import com.example.chatapp.dto.ReportDTO2;
import com.example.chatapp.model.Report;
import com.example.chatapp.repository.ReportRepo;

@Service
public class ReportService {
    @Autowired
    private ReportRepo reportRepo;

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

    public ReportDTO2 findReportById(int reportId) {
        Report report = reportRepo.findReportById(reportId);
        return new ReportDTO2(report.getReportId(), report.getUserSend().getUserId(), report.getUserSend().getUserName(), report.getReportedUserId(), report.getContent(), report.getCreatedAt());
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

    public boolean saveReport(ReportDTO report) {
        int rows = reportRepo.saveReport(report.getUserIdSend(), report.getReportedUserId(), report.getContent(), LocalDateTime.now());
        return rows > 0;
    }
}
