const express = require("express");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");
const uploadFile = require("../../helpers/upload_file.helpers");
const router = express.Router();

const store = uploadFile.single("news_image");

const {
  getNews,
  getNewsByID,
  createNews,
  updateNews,
  deleteNews,
} = require("./news.controller");

router.get("/news", authMiddleware, getNews);
router.get("/news/:id", authMiddleware, getNewsByID);
router.post("/news/create", authMiddleware, adminMiddleware, store, createNews);
router.put(
  "/news/:id/update",
  authMiddleware,
  adminMiddleware,
  store,
  updateNews
);
router.delete("/news/:id/delete", authMiddleware, adminMiddleware, deleteNews);

module.exports = router;
