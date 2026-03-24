const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/siteController");

// Helper to build routes for each content type
function buildRoutes(base, handler) {
  router.get(`/${base}`, handler.getAll);
  router.get(`/${base}/all`, auth, handler.getAllAdmin);
  router.post(`/${base}`, auth, handler.create);
  router.put(`/${base}/:id`, auth, handler.update);
  router.delete(`/${base}/:id`, auth, handler.delete);
}

buildRoutes("testimonials", ctrl.testimonials);
buildRoutes("partners", ctrl.partners);
buildRoutes("faqs", ctrl.faqs);
buildRoutes("team", ctrl.team);
buildRoutes("awards", ctrl.awards);

module.exports = router;
