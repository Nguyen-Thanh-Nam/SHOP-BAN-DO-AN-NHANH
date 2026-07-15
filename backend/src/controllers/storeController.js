const StoreService = require("../services/storeService");

class StoreController {
    static async getAll(req, res) {
        try {
            const data = await StoreService.getAllStores();
            res.json({ message: "Lấy danh sách thành công", data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getDetail(req, res) {
        try {
            const data = await StoreService.getStoreDetail(req.params.id);
            res.json({ message: "Lấy chi tiết thành công", data });
        } catch (err) {
            if (err.message === "Cửa hàng không tồn tại") {
                return res.status(404).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const id = await StoreService.createStore(req.body);
            res.status(201).json({ message: "Tạo cửa hàng thành công", id });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            await StoreService.updateStore(req.params.id, req.body);
            res.json({ message: "Cập nhật thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await StoreService.deleteStore(req.params.id);
            res.json({ message: "Xóa thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = StoreController;
