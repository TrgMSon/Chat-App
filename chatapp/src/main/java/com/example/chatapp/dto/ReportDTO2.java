package com.example.chatapp.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportDTO2 {
    private int reportId;
    private String userSendId;
    private String userSendName;
    private String reportedUserId;
    private String content;
    private LocalDateTime createdAt;
}
