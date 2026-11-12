# Chat App

Ứng dụng nhắn tin trực tuyến. Người dùng có thể trò chuyện cá nhân hoặc theo nhóm, chia sẻ tệp và quản lý thông tin cá nhân; quản trị viên có giao diện riêng để quản lý người dùng và báo cáo.

## Tính năng chính

- Đăng ký, đăng nhập và đăng xuất.
- Trò chuyện cá nhân và trò chuyện nhóm theo thời gian thực.
- Gửi tệp trong cuộc trò chuyện; Cloudinary được dùng để hỗ trợ lưu trữ và tải tệp.
- Tìm kiếm người dùng, tạo cuộc trò chuyện, quản lý thành viên nhóm và đổi tên phòng.
- Xem thông tin, cập nhật hồ sơ và gửi báo cáo người dùng.
- Xem lịch sử tin nhắn theo trang và trạng thái đã đọc của cuộc trò chuyện.
- Giao diện quản trị để xem, tìm kiếm người dùng và báo cáo, cũng như thay đổi trạng thái người dùng.

## Công nghệ

- Java 21, Spring Boot 3.5
- Spring MVC, Thymeleaf, Spring Data JPA
- WebSocket với STOMP và SockJS
- MySQL
- Cloudinary
- Maven

## Yêu cầu

- JDK 21
- MySQL
- Tài khoản Cloudinary

## Cấu hình

Ứng dụng cần các biến môi trường sau:

| Biến | Mô tả |
| --- | --- |
| `DB_URL` | JDBC URL của cơ sở dữ liệu MySQL |
| `DB_USERNAME` | Tên đăng nhập MySQL |
| `DB_PASSWORD` | Mật khẩu MySQL |
| `CLOUDINARY_NAME` | Cloud name của Cloudinary |
| `CLOUDINARY_API_KEY` | API key của Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret của Cloudinary |

Ba biến Cloudinary có thể được đặt trong file `.env` ở thư mục gốc khi chạy cục bộ; ứng dụng cũng hỗ trợ đọc chúng từ environment variables. Các biến kết nối cơ sở dữ liệu được Spring Boot đọc từ environment variables. Không commit thông tin xác thực vào Git.

Đảm bảo MySQL đang chạy và `DB_URL` trỏ đến cơ sở dữ liệu đã được chuẩn bị cho ứng dụng.

## Chạy ứng dụng

Từ thư mục gốc của dự án, chạy:

```powershell
.\mvnw.cmd spring-boot:run
```

Sau khi ứng dụng khởi động, mở [http://localhost:8080](http://localhost:8080). Trang đăng nhập cũng là trang mặc định.

Để chạy kiểm thử:

```powershell
.\mvnw.cmd test
```

## Docker và Render

Dockerfile trong dự án đóng gói ứng dụng bằng Java 21. Ứng dụng sử dụng cổng do biến môi trường `PORT` cung cấp; nếu chạy cục bộ mà biến này chưa được đặt, cổng mặc định là `8080`.

Để deploy trên Render:

1. Tạo một **Web Service** từ repository và chọn runtime **Docker**.
2. Để Render sử dụng `Dockerfile` ở thư mục gốc để build và chạy ứng dụng.
3. Trong phần **Environment**, thiết lập `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY` và `CLOUDINARY_API_SECRET`.
4. Deploy service. Render tự cấp `PORT`; không cần đặt cứng cổng trong cấu hình service.

Đảm bảo cơ sở dữ liệu MySQL có thể truy cập từ service trên Render và đã được chuẩn bị schema mà ứng dụng sử dụng.
