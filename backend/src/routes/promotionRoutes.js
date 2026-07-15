const express = require("express");
const router = express.Router();
const PromotionController = require("../controllers/promotionController");
const multer = require("multer");
const path = require("path");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/promotions/"),
    filename: (req, file, cb) =>
        cb(null, "promo-" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

router.get("/", PromotionController.getList);
router.get("/:slug", PromotionController.getDetail);
router.post(
    "/",
    verifyToken,
    authorize(["admin"]),
    upload.single("image"),
    PromotionController.create
);
router.put(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    upload.single("image"),
    PromotionController.update
);
router.delete(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    PromotionController.delete
);

module.exports = router;
