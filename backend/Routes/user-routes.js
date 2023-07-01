const express = require("express");
const {
  signup,
  login,
  getmethed
} = require("../Controllers/user-controller");
const validateUserToken = require("../middleware/userToken");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);


module.exports = router;
