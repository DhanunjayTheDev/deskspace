const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const transformations = {
  avatar: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
  logo:   [{ width: 600, height: 300, crop: "limit", quality: "auto" }],
  award:  [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
  team:   [{ width: 600, height: 600, crop: "fill", quality: "auto" }],
  default:[{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
};

router.post("/", auth, (req, res) => {
  const type = req.query.type || "default";
  const folder = type === "default" ? "deskspace" : `deskspace/${type}`;
  const transformation = transformations[type] || transformations.default;

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation,
    },
  });

  const upload = multer({ storage }).single("image");

  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    res.json({ url: req.file.path });
  });
});

module.exports = router;
