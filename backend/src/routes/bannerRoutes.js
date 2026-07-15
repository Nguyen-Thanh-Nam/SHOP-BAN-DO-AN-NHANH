const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/bannerController");
const multer = require("multer");
const path = require("path");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/banners/"),
    filename: (req, file, cb) =>
        cb(
            null,
            "banner-" +
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                path.extname(file.originalname)
        ),
});
const upload = multer({ storage: storage });

const uploadFields = upload.fields([
    { name: "image_desktop", maxCount: 1 },
    { name: "image_mobile", maxCount: 1 },
]);

router.get("/home", BannerController.getHome);
router.get("/", BannerController.getAll);
router.post(
    "/",
    verifyToken,
    authorize(["admin"]),
    uploadFields,
    BannerController.create
);
router.put(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    uploadFields,
    BannerController.update
);
router.delete(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    BannerController.delete
);

module.exports = router;
