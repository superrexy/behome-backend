const express = require("express");
const authMiddleware = require("../../middleware/auth");
const orderController = require("./order.controller");
const router = express.Router();

router.get("/order", authMiddleware, orderController.getOrders);
router.post("/order", authMiddleware, orderController.createOrder);

module.exports = router;
