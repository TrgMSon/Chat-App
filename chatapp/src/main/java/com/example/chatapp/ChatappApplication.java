package com.example.chatapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatappApplication { 
	// chuyển hướng http sang https, check account có bị banned không
	// báo cáo user direct
	// chỉnh lại gửi ảnh và textarea cho gửi tin nhắn text để gửi được dấu xuống dòng (hiện đang là input)
	
	public static void main(String[] args) {
		SpringApplication.run(ChatappApplication.class, args);
	}

}
