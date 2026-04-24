package com.example.chatapp.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.model.Report;

@Repository
public interface ReportRepo extends JpaRepository<Report, Integer> {
    
    @Query(value = "SELECT * FROM report", nativeQuery = true)
    ArrayList<Report> getAllReports();

    @Query(value = "SELECT COUNT(*) FROM report WHERE created_at LIKE ?1", nativeQuery = true)
    int getQtyReport(String month);

    // @Query(value = "SELECT COUNT(*) FROM user WHERE role='user'", nativeQuery = true)
    // int getQtyUser();

    @Query(value = "SELECT * FROM report WHERE report_id = ?1", nativeQuery = true)
    Report findReportById(int reportId);

    // @Query(value = "SELECT * FROM user WHERE role='user'", nativeQuery = true)
    // ArrayList<User> findAllUser();

    // @Query(value = "SELECT * FROM user WHERE role='user' AND user_id=?1", nativeQuery = true)
    // User findUserById(String userId);

    @Query(value = "SELECT report_id FROM report WHERE created_at >= ?1 AND created_at < ?2", nativeQuery = true)
    ArrayList<Integer> findReportByCreatedAt(LocalDateTime start, LocalDateTime end);

    // @Transactional
    // @Modifying
    // @Query(value = "UPDATE user SET status=?1 WHERE user_id=?2", nativeQuery = true)
    // void changeStatusUser(String status, String userId);
}
