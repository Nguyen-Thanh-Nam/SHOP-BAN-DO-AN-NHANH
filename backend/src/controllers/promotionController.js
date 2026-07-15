const PromotionService = require("../services/promotionService");

class PromotionController {
    static async getList(req, res) {
        try {
            const { limit } = req.query;
            const data = await PromotionService.getClientList({ limit });
            res.json({ data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getDetail(req, res) {
        try {
            const data = await PromotionService.getDetail(req.params.slug);
            if (!data)
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy chương trình" });
            res.json({ data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const data = { ...req.body };
            if (req.file)
                data.image = `/uploads/promotions/${req.file.filename}`;

            const id = await PromotionService.create(data);
            res.status(201).json({ message: "Tạo khuyến mãi thành công", id });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const data = { ...req.body };
            if (req.file)
                data.image = `/uploads/promotions/${req.file.filename}`;

            await PromotionService.update(req.params.id, data);
            res.json({ message: "Cập nhật thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await PromotionService.delete(req.params.id);
            res.json({ message: "Xóa thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = PromotionController;
