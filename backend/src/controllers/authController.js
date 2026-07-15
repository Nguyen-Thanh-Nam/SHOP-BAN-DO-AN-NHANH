const AuthService = require("../services/authService");

class AuthController {
    static async register(req, res) {
        try {
            const newUser = await AuthService.register(req.body);
            res.status(201).json({
                message: "Đăng ký thành công",
                data: newUser,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
            res.status(200).json({
                message: "Đăng nhập thành công",
                data: result,
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const tokens = await AuthService.refreshToken(refreshToken);
            res.status(200).json({
                message: "Làm mới token thành công",
                tokens,
            });
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await AuthService.logout(refreshToken);
            res.status(200).json({ message: "Đăng xuất thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await AuthService.getProfile(req.user.id);
            res.status(200).json({
                message: "Lấy thông tin thành công",
                data: user,
            });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;

            const updateData = { ...req.body };

            if (req.file) {
                const avatarPath = `/uploads/${req.file.filename}`;
                updateData.avatar = avatarPath;
            }

            const updatedUser = await AuthService.updateProfile(
                userId,
                updateData
            );

            res.status(200).json({
                message: "Cập nhật thông tin thành công",
                data: updatedUser,
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            console.log(req.user);

            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng nhập đầy đủ thông tin" });
            }

            if (newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Mật khẩu mới phải từ 6 ký tự trở lên" });
            }

            await AuthService.changePassword(userId, {
                currentPassword,
                newPassword,
            });

            res.json({ message: "Đổi mật khẩu thành công" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async forgotPassword(req, res) {
        try {
            await AuthService.forgotPassword(req.body.email);
            res.json({
                message: "Vui lòng kiểm tra email để đặt lại mật khẩu",
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            await AuthService.resetPassword(token, newPassword);
            res.json({ message: "Đặt lại mật khẩu thành công" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = AuthController;
