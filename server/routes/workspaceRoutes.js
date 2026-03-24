const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const ctrl = require("../controllers/workspaceController");

router.get("/", ctrl.getWorkspaces);
router.get("/:id", ctrl.getWorkspaceById);
router.post("/", auth, upload.array("images", 10), ctrl.createWorkspace);
router.put("/:id", auth, upload.array("images", 10), ctrl.updateWorkspace);
router.delete("/:id", auth, ctrl.deleteWorkspace);

module.exports = router;
