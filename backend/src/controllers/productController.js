const ProductService = require("../services/productService");
const ProductModel = require("../models/productModel");

class ProductController {
    static async getAll(req, res) {
        try {
            const { category_id, category_slug, limit } = req.query;

            const data = await ProductService.getAll({
                category_id,
                category_slug,
                limit,
            });

            res.json({ message: "Thành công", data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async searchProducts(req, res) {
        try {
            const { keyword } = req.query;

            if (!keyword || keyword.trim() === "") {
                return res.json([]);
            }

            const products = await ProductModel.search(keyword);
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi tìm kiếm sản phẩm" });
        }
    }

    static async getDetail(req, res) {
        try {
            const data = await ProductService.getDetail(req.params.id);
            if (!data)
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy sản phẩm" });
            res.json({ message: "Lấy chi tiết thành công", data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const data = { ...req.body };
            if (req.file) data.image = `/uploads/products/${req.file.filename}`;

            if (typeof data.option_groups === "string") {
                data.option_groups = JSON.parse(data.option_groups);
            }

            const id = await ProductService.create(data);
            res.status(201).json({ message: "Tạo sản phẩm thành công", id });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const data = { ...req.body };
            if (req.file) data.image = `/uploads/products/${req.file.filename}`;
            if (typeof data.option_groups === "string") {
                data.option_groups = JSON.parse(data.option_groups);
            }

            await ProductService.update(req.params.id, data);
            res.json({ message: "Cập nhật thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await ProductService.delete(req.params.id);
            res.json({ message: "Xóa sản phẩm thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ProductController;
