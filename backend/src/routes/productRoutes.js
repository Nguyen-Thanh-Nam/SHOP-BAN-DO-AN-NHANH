const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/products/"),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "prod-" + unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.get("/", ProductController.getAll);
router.get("/search", ProductController.searchProducts);
router.post(
    "/",
    verifyToken,
    authorize(["admin"]),
    upload.single("image"),
    ProductController.create
);
router.get("/:id", ProductController.getDetail);
router.put(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    upload.single("image"),
    ProductController.update
);
router.delete(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    ProductController.delete
);

module.exports = router;
