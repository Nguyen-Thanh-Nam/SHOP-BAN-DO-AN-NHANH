const CouponService = require("../services/couponService");

class CouponController {
    static async getAll(req, res) {
        try {
            const data = await CouponService.getAll();
            res.json({ data });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const id = await CouponService.create(req.body);
            res.status(201).json({ message: "Tạo mã giảm giá thành công", id });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            await CouponService.update(req.params.id, req.body);
            res.json({ message: "Cập nhật thành công" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await CouponService.delete(req.params.id);
            res.json({ message: "Xóa thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async check(req, res) {
        try {
            const { code, cartTotal } = req.body;

            if (!code || cartTotal === undefined) {
                return res.status(400).json({
                    message: "Vui lòng nhập mã và tổng tiền đơn hàng",
                });
            }

            const result = await CouponService.checkCoupon(code, cartTotal);

            res.json({
                message: "Áp dụng mã thành công!",
                data: result,
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = CouponController;
