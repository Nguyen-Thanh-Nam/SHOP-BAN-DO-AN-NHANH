const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

router.get("/", verifyToken, CartController.getCart);
router.post("/add", verifyToken, CartController.addToCart);
router.put("/update", verifyToken, CartController.updateQuantity);
router.delete("/:cartId", verifyToken, CartController.removeItem);

module.exports = router;
