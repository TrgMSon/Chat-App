package com.example.chatapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatappApplication { // chuyển hướng http sang https, check account có bị banned không, hiển thị thời gian gửi message

	public static void main(String[] args) {
		SpringApplication.run(ChatappApplication.class, args);
	}

}
