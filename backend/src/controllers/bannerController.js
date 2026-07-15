const BannerService = require("../services/bannerService");

class BannerController {
    static async getHome(req, res) {
        const data = await BannerService.getForHome();
        res.json({ data });
    }

    static async getAll(req, res) {
        const data = await BannerService.getAll();
        res.json({ data });
    }

    static async create(req, res) {
        try {
            const data = { ...req.body };

            if (req.files) {
                if (req.files["image_desktop"]) {
                    data.image_desktop = `/uploads/banners/${req.files["image_desktop"][0].filename}`;
                }
                if (req.files["image_mobile"]) {
                    data.image_mobile = `/uploads/banners/${req.files["image_mobile"][0].filename}`;
                }
            }

            const id = await BannerService.create(data);
            res.status(201).json({ message: "Tạo banner thành công", id });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const data = { ...req.body };

            if (req.files) {
                if (req.files["image_desktop"]) {
                    data.image_desktop = `/uploads/banners/${req.files["image_desktop"][0].filename}`;
                }
                if (req.files["image_mobile"]) {
                    data.image_mobile = `/uploads/banners/${req.files["image_mobile"][0].filename}`;
                }
            }

            await BannerService.update(req.params.id, data);
            res.json({ message: "Cập nhật banner thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        await BannerService.delete(req.params.id);
        res.json({ message: "Xóa thành công" });
    }
}

module.exports = BannerController;
