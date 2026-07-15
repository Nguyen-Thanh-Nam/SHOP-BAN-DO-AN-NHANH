const OrderService = require("../services/orderService");
const OrderModel = require("../models/orderModel");

class OrderController {
    static async create(req, res) {
        try {
            const {
                full_name,
                phone_number,
                address,
                note,
                subtotal,
                shipping_fee,
                discount_amount,
                total,
                coupon_code,
                payment_method,
                items,
            } = req.body;

            const user_id = req.user ? req.user.id : null;

            if (!items || items.length === 0) {
                return res
                    .status(400)
                    .json({ message: "Giỏ hàng không được để trống" });
            }

            const orderData = {
                user_id,
                full_name,
                phone_number,
                address,
                note,
                subtotal,
                shipping_fee,
                discount_amount,
                total,
                coupon_code,
                payment_method,
            };

            const orderId = await OrderService.createOrder(orderData, items);

            res.status(201).json({
                message: "Đặt hàng thành công",
                order_id: orderId,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Lỗi tạo đơn hàng: " + err.message,
            });
        }
    }

    static async sepayCallback(req, res) {
        try {
            const apiKey = req.headers.authorization?.replace("Apikey ", "");
            const expectedApiKey = process.env.SEPAY_API_KEY;

            if (!apiKey || apiKey !== expectedApiKey) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - Invalid API key",
                });
            }

            console.log("SePay Webhook Body:", req.body);

            const result = await OrderService.processSePayWebhook(req.body);

            res.status(200).json(result);
        } catch (error) {
            console.error("Error processing SePay callback:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    static async getDetail(req, res) {
        try {
            const { id } = req.params;
            const order = await OrderModel.findById(id);

            if (!order) {
                return res
                    .status(404)
                    .json({ message: "Đơn hàng không tồn tại" });
            }

            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    static async getAll(req, res) {
        try {
            const data = await OrderService.getAllOrders();
            res.json({ data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server lấy danh sách đơn" });
        }
    }

    static async getDetail(req, res) {
        try {
            const { id } = req.params;
            const data = await OrderService.getOrderDetailFull(id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            await OrderService.updateOrderStatus(id, status);
            res.json({ message: "Cập nhật trạng thái thành công" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getHistoryByPhone(req, res) {
        try {
            const { phone } = req.params;
            const orders = await OrderModel.findByPhone(phone);

            res.json({ data: orders });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
}

module.exports = OrderController;
