const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");
router.post("/", verifyTokenOptional, OrderController.create);

router.post("/sepay-webhook", OrderController.sepayCallback);

router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getDetail);
router.put(
    "/:id/status",
    verifyToken,
    authorize(["admin", "staff"]),
    OrderController.updateStatus
);
router.get("/history/:phone", OrderController.getHistoryByPhone);

module.exports = router;
