# Crispc - Food Ordering System

Website đặt món ăn trực tuyến được xây dựng với kiến trúc Full-stack, bao gồm giao diện người dùng hiện đại và hệ thống quản trị phân quyền chặt chẽ.

## Công nghệ sử dụng

### Frontend
- **Framework:** Next.js 13+ (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** Zustand
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **Security:** Bcrypt, CORS
- **File Upload:** Multer
- **Email Service:** Nodemailer

---

## Tính năng chính

### 1. Người dùng (Client)
- **Xác thực:** Đăng ký, Đăng nhập, Đăng xuất.
- **Quên mật khẩu:** Gửi link đặt lại mật khẩu qua Email.
- **Hồ sơ cá nhân:**
  - Cập nhật thông tin.
  - Tải lên/Thay đổi Avatar.
  - Đổi mật khẩu.
- **Trang chủ & Menu:**
  - Hiển thị danh sách món ăn theo danh mục.
  - Lọc món ăn theo danh mục.
  - **Tìm kiếm:** Tìm kiếm món ăn theo tên.
  - Xem chi tiết món ăn.
- **Giỏ hàng:** Thêm món, hiển thị số lượng trên Header.

### 2. Quản trị viên (Admin)
- **Dashboard:** Truy cập trang quản trị riêng biệt.
- **Quản lý toàn quyền:** Sản phẩm, Danh mục, Đơn hàng, Banner, Cửa hàng, Mã giảm giá.
- **Quản lý người dùng:** Xem danh sách, Phân quyền (User/Staff/Admin), Khóa tài khoản.

### 3. Nhân viên (Staff)
- **Giới hạn quyền truy cập:** Chỉ được truy cập Dashboard và Quản lý Đơn hàng.
- **Bảo mật:** Không được phép xóa dữ liệu hoặc truy cập các mục nhạy cảm (User, Settings).
