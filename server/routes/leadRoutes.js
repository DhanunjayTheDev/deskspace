const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/leadController");

router.post("/", ctrl.createLead);
router.get("/", auth, ctrl.getLeads);
router.get("/stats", auth, ctrl.getStats);
router.patch("/:id", auth, ctrl.updateLeadStatus);

module.exports = router;
