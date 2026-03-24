const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/adminController");

router.post("/login", ctrl.login);
router.get("/me", auth, ctrl.me);

module.exports = router;
