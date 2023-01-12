const express = require("express");
const authMiddleware = require("../../middleware/auth");
const uploadFile = require("../../helpers/upload_file.helpers");
const router = express.Router();

const store = uploadFile.single("user_image");

const { profile, updateProfile } = require("./users.controller");

router.get("/users/profile", authMiddleware, profile);
router.put("/users/profile", authMiddleware, store, updateProfile);

module.exports = router;
