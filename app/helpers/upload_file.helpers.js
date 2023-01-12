const multer = require("multer");
const sharp = require("sharp");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    const date = new Date().toJSON().slice(0, 10);
    const uniquePrefix = date + "_" + Math.round(Math.random() * 1e9);
    callback(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = upload;
