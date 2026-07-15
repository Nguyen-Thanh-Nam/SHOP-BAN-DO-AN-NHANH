const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const multer = require("multer");
const path = require("path");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/categories/"),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "cat-" + unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getDetail);
router.post(
    "/",
    verifyToken,
    authorize(["admin"]),
    upload.single("image"),
    CategoryController.create
);
router.put(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    upload.single("image"),
    CategoryController.update
);
router.delete(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    CategoryController.delete
);

module.exports = router;
