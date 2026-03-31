package com.example.chatapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        // Load dotenv nhưng không bắt buộc phải có file
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // CÁCH LẤY BIẾN THÔNG MINH: 
        // Thử lấy từ System Environment (Render/Railway) trước, nếu không có mới lấy từ .env (Local)
        String cloudName = System.getenv("CLOUDINARY_NAME");
        if (cloudName == null) cloudName = dotenv.get("CLOUDINARY_NAME");

        String apiKey = System.getenv("CLOUDINARY_API_KEY");
        if (apiKey == null) apiKey = dotenv.get("CLOUDINARY_API_KEY");

        String apiSecret = System.getenv("CLOUDINARY_API_SECRET");
        if (apiSecret == null) apiSecret = dotenv.get("CLOUDINARY_API_SECRET");

        // Debug (Chỉ nên dùng khi dev, xóa khi deploy thật để bảo mật)
        System.out.println("Cloud Name: " + cloudName);

        if (cloudName == null || apiKey == null || apiSecret == null) {
            throw new RuntimeException("Cấu hình Cloudinary bị thiếu! Hãy kiểm tra Environment Variables hoặc file .env");
        }

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }
}
