const db = require("../config/db");
const OrderModel = require("../models/orderModel");
const CartModel = require("../models/cartModel");

class OrderService {
    static async createOrder(orderData, items) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const orderId = await OrderModel.createOrder(connection, orderData);

            const itemPromises = items.map((item) => {
                return OrderModel.createOrderItem(connection, orderId, item);
            });
            await Promise.all(itemPromises);

            if (orderData.user_id) {
                const userCart = await CartModel.findByUserId(
                    orderData.user_id
                );
                if (userCart) {
                    await CartModel.clearCart(userCart.id);
                }
            }

            await connection.commit();

            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async processSePayWebhook(data) {
        const {
            gateway,
            transactionDate,
            accountNumber,
            code,
            content,
            transferType,
            transferAmount,
            referenceCode,
        } = data;

        if (transferType !== "in") {
            return {
                success: true,
                message: "Ignored: Not an incoming transfer",
            };
        }

        const regex = /(ORD[A-Z0-9]+)/i;

        let orderId = null;

        if (code && code.toUpperCase().startsWith("ORD")) {
            orderId = code;
        } else if (content) {
            const match = content.match(regex);
            if (match) {
                orderId = match[1];
            }
        }

        console.log(orderId);

        if (!orderId) {
            console.log(
                "SePay: Cannot identify Order ID from content:",
                content
            );
            return { success: true, message: "Cannot identify order ID" };
        }

        const order = await OrderModel.findById(orderId);
        if (!order) {
            console.log("SePay: Order not found:", orderId);
            return { success: true, message: "Order not found" };
        }

        if (order.status !== "pending") {
            return { success: true, message: "Order already processed" };
        }

        const orderTotal = parseFloat(order.total);
        const paidAmount = parseFloat(transferAmount);

        if (paidAmount < orderTotal) {
            console.log(
                `SePay: Insufficient amount. Order: ${orderTotal}, Paid: ${paidAmount}`
            );
            return { success: true, message: "Payment amount insufficient" };
        }

        await OrderModel.updatePaymentStatus(orderId, "processing", "banking");

        return {
            success: true,
            message: "Order updated successfully",
            orderId,
        };
    }

    static async getAllOrders() {
        return await OrderModel.getAll();
    }

    static async getOrderDetailFull(orderId) {
        const order = await OrderModel.findById(orderId);
        if (!order) throw new Error("Đơn hàng không tồn tại");

        const items = await OrderModel.getItemsByOrderId(orderId);

        return { ...order, items };
    }

    static async updateOrderStatus(orderId, status) {
        const validStatuses = [
            "pending",
            "processing",
            "shipping",
            "completed",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            throw new Error("Trạng thái không hợp lệ");
        }
        return await OrderModel.updateStatus(orderId, status);
    }
}

module.exports = OrderService;
