const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

router.get("/", verifyToken, authorize(["admin"]), UserController.getAll);
router.get("/:id", verifyToken, authorize(["admin"]), UserController.getDetail);
router.put("/:id", verifyToken, authorize(["admin"]), UserController.update);
router.delete("/:id", verifyToken, authorize(["admin"]), UserController.delete);

module.exports = router;
