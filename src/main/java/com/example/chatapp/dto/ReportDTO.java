package com.example.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportDTO {
    private String userIdSend;
    private String reportedUserId;
    private String content;
}
