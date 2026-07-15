const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access Token không được cung cấp" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "Token không hợp lệ hoặc hết hạn" });
        }
        req.user = user;
        next();
    });
};

const verifyTokenOptional = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
};

// authorize(['admin', 'staff'])
const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Chưa xác thực danh tính" });
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: "Bạn không có quyền thực hiện thao tác này" });
        }

        next();
    };
};

module.exports = { verifyToken, verifyTokenOptional, authorize };
