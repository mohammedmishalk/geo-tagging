const express = require("express");
const multer = require("multer");
const { storage } = require("../middleware/cloudinary");

const {
  signup,
  login,
  postPhoto,
  getImage
} = require("../Controllers/user-controller");

const validateUserToken = require("../middleware/userToken");
const upload = multer({ storage });
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getimage", validateUserToken, getImage);
router.post("/photo", validateUserToken,upload.single("photo"), postPhoto);


module.exports = router;
