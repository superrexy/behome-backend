const express = require("express");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");
const chatsController = require("./chats.controller");

const router = express.Router();

router.get("/chats/:chat_id", authMiddleware, chatsController.getChat);
router.post("/chats", authMiddleware, chatsController.sendMessage);

module.exports = router;
