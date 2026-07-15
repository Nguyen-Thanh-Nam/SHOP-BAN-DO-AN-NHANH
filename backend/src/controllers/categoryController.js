const CategoryService = require("../services/categoryService");

class CategoryController {
    static async getAll(req, res) {
        try {
            const list = await CategoryService.getAll();
            res.json({ message: "Lấy danh sách thành công", data: list });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getDetail(req, res) {
        try {
            const category = await CategoryService.getDetail(req.params.id);
            res.json({ message: "Lấy chi tiết thành công", data: category });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const data = { ...req.body };
            if (req.file)
                data.image = `/uploads/categories/${req.file.filename}`;

            const id = await CategoryService.create(data);
            res.status(201).json({ message: "Tạo danh mục thành công", id });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const data = { ...req.body };
            if (req.file)
                data.image = `/uploads/categories/${req.file.filename}`;

            await CategoryService.update(req.params.id, data);
            res.json({ message: "Cập nhật danh mục thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await CategoryService.delete(req.params.id);
            res.json({ message: "Xóa danh mục thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = CategoryController;
