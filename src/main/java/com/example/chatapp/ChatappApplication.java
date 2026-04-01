package com.example.chatapp;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class ChatappApplication {
	@PostConstruct
	public void init() {
		// Thiết lập múi giờ mặc định cho toàn bộ ứng dụng Java này
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}

	public static void main(String[] args) {
		SpringApplication.run(ChatappApplication.class, args);
	}

}
