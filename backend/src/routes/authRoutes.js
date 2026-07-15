const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", verifyToken, AuthController.logout);
router.post("/change-password", verifyToken, AuthController.changePassword);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", verifyToken, AuthController.resetPassword);

router.get("/profile", verifyToken, AuthController.getProfile);
router.put(
    "/profile",
    verifyToken,
    upload.single("avatar"),
    AuthController.updateProfile
);

module.exports = router;
