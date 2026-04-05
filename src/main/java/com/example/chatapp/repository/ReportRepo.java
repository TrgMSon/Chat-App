package com.example.chatapp.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.chatapp.model.Report;
import com.example.chatapp.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface ReportRepo extends JpaRepository<Report, Integer> {
    
    @Query(value = "SELECT * FROM report", nativeQuery = true)
    ArrayList<Report> getAllReports();

    @Query(value = "SELECT COUNT(*) FROM report WHERE created_at LIKE ?1", nativeQuery = true)
    int getQtyReport(String month);

    @Query(value = "SELECT COUNT(*) FROM user WHERE role='user'", nativeQuery = true)
    int getQtyUser();

    @Query(value = "SELECT * FROM report WHERE report_id = ?1", nativeQuery = true)
    Report findReportById(int reportId);

    @Query(value = "SELECT * FROM user WHERE role='user'", nativeQuery = true)
    ArrayList<User> findAllUser();

    @Query(value = "SELECT * FROM user WHERE role='user' AND user_id=?1", nativeQuery = true)
    User findUserById(String userId);

    @Query(value = "SELECT user_id FROM user WHERE role='user' AND (user_id=?1 OR user_name LIKE ?2)", nativeQuery = true)
    ArrayList<String> findUserByTarget(String userId, String userName);

    @Transactional
    @Modifying
    @Query(value = "UPDATE user SET status=?1 WHERE user_id=?2", nativeQuery = true)
    void changeStatusUser(String status, String userId);
}
