package com.example.chatapp.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.chatapp.model.Report;

import jakarta.transaction.Transactional;

public interface ReportRepo extends JpaRepository<Report, Integer> {

    @Query(value = "SELECT * FROM report ORDER BY created_at DESC", nativeQuery = true)
    ArrayList<Report> getAllReports();

    @Query(value = "SELECT COUNT(*) FROM report WHERE created_at LIKE ?1", nativeQuery = true)
    int getQtyReport(String month);

    @Query(value = "SELECT * FROM report WHERE report_id = ?1", nativeQuery = true)
    Report findReportById(int reportId);

    @Query(value = "SELECT report_id FROM report WHERE created_at >= ?1 AND created_at < ?2", nativeQuery = true)
    ArrayList<Integer> findReportByCreatedAt(LocalDateTime start, LocalDateTime end);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO report(user_send_id, reported_user_id, content, created_at) VALUES(?1, ?2, ?3, ?4)", nativeQuery = true)
    int saveReport(String userSendId, String reportedUserId, String content, LocalDateTime createdAt);
}
