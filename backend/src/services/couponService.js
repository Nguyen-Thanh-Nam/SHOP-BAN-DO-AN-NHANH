const CouponModel = require("../models/couponModel");

class CouponService {
    static async getAll() {
        return await CouponModel.getAll();
    }

    static async create(data) {
        const exists = await CouponModel.getByCode(data.code);
        if (exists) throw new Error("Mã giảm giá này đã tồn tại");

        if (data.discount_type === "percent" && data.discount_value > 100) {
            throw new Error("Phần trăm giảm giá không thể lớn hơn 100");
        }

        return await CouponModel.create(data);
    }

    static async update(id, data) {
        return await CouponModel.update(id, data);
    }

    static async delete(id) {
        return await CouponModel.delete(id);
    }

    static async checkCoupon(code, cartTotal) {
        const coupon = await CouponModel.getByCode(code);

        if (!coupon) {
            throw new Error("Mã giảm giá không tồn tại");
        }

        if (coupon.is_active === 0) {
            throw new Error("Mã giảm giá này đang bị khóa");
        }

        const now = new Date();
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            throw new Error("Mã giảm giá chưa đến thời gian áp dụng");
        }
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            throw new Error("Mã giảm giá đã hết hạn");
        }

        if (
            coupon.usage_limit > 0 &&
            coupon.usage_count >= coupon.usage_limit
        ) {
            throw new Error("Mã giảm giá đã hết lượt sử dụng");
        }

        if (cartTotal < parseFloat(coupon.min_order_value)) {
            const missing = parseFloat(coupon.min_order_value) - cartTotal;
            throw new Error(
                `Mua thêm ${missing.toLocaleString("vi-VN")}đ để sử dụng mã này`
            );
        }

        let discountAmount = 0;
        if (coupon.discount_type === "fixed") {
            discountAmount = parseFloat(coupon.discount_value);
        } else {
            discountAmount =
                cartTotal * (parseFloat(coupon.discount_value) / 100);
            if (coupon.max_discount_amount) {
                discountAmount = Math.min(
                    discountAmount,
                    parseFloat(coupon.max_discount_amount)
                );
            }
        }

        discountAmount = Math.min(discountAmount, cartTotal);

        return {
            ...coupon,
            calculated_discount: discountAmount,
        };
    }
}

module.exports = CouponService;
