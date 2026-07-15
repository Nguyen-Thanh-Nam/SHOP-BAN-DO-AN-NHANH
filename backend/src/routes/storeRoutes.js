const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/storeController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

router.get("/", StoreController.getAll);
router.get("/:id", StoreController.getDetail);
router.post("/", verifyToken, authorize(["admin"]), StoreController.create);
router.put("/:id", verifyToken, authorize(["admin"]), StoreController.update);
router.delete(
    "/:id",
    verifyToken,
    authorize(["admin"]),
    StoreController.delete
);

module.exports = router;
