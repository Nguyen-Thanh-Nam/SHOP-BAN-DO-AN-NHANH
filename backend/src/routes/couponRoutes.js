const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/couponController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

router.get("/", CouponController.getAll);
router.post("/", verifyToken, authorize(["admin"]), CouponController.create);
router.put("/:id", verifyToken, authorize(["admin"]), CouponController.update);
router.delete(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    CouponController.delete
);

router.post("/check", CouponController.check);

module.exports = router;
