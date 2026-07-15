const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/addressController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

router.get("/", verifyToken, AddressController.getList);
router.post("/", verifyToken, AddressController.create);
router.put("/:id", verifyToken, AddressController.update);
router.delete("/:id", verifyToken, AddressController.delete);
router.put("/:id/set-default", verifyToken, AddressController.setDefault);

module.exports = router;
