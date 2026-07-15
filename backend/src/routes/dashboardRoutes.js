const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController");
const {
    verifyToken,
    verifyTokenOptional,
    authorize,
} = require("../middlewares/authMiddleware");

router.get(
    "/stats",
    verifyToken,
    authorize(["admin", "staff"]),
    DashboardController.getStats
);

module.exports = router;
