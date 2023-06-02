const express = require("express");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");
const uploadFile = require("../../helpers/upload_file.helpers");
const router = express.Router();

const store = uploadFile.single("psikologs_image");

const {
  getPsikologs,
  getPsikologByID,
  updatePsikolog,
} = require("./psikologs.controller");

router.get("/psikologs", authMiddleware, getPsikologs);
router.get("/psikologs/:id", authMiddleware, getPsikologByID);
router.put(
  "/psikologs/:id/update",
  authMiddleware,
  adminMiddleware(["admin"]),
  store,
  updatePsikolog
);

module.exports = router;
