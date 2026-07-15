const AddressService = require("../services/addressService");

class AddressController {
    static async getList(req, res) {
        try {
            const userId = req.user.id;
            const list = await AddressService.getList(userId);
            res.status(200).json({
                message: "Lấy danh sách thành công",
                data: list,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const userId = req.user.id;
            const newAddr = await AddressService.addAddress(userId, req.body);
            res.status(201).json({
                message: "Thêm địa chỉ thành công",
                data: newAddr,
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;
            const updated = await AddressService.updateAddress(
                userId,
                addressId,
                req.body
            );
            res.status(200).json({
                message: "Cập nhật thành công",
                data: updated,
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;
            await AddressService.deleteAddress(userId, addressId);
            res.status(200).json({ message: "Xóa địa chỉ thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async setDefault(req, res) {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;
            await AddressService.setDefault(userId, addressId);
            res.status(200).json({ message: "Đã đặt làm mặc định" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = AddressController;
