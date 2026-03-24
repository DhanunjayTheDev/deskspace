const Testimonial = require("../models/Testimonial");
const Partner = require("../models/Partner");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");
const Award = require("../models/Award");

function createCRUD(Model) {
  return {
    getAll: async (req, res) => {
      try {
        const items = await Model.find({ isActive: true })
          .sort({ order: 1, createdAt: 1 })
          .lean();
        res.json(items);
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },
    getAllAdmin: async (req, res) => {
      try {
        const items = await Model.find().sort({ order: 1, createdAt: 1 }).lean();
        res.json(items);
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },
    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
      }
    },
    update: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
      } catch (err) {
        res.status(400).json({ message: "Update error", error: err.message });
      }
    },
    delete: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted" });
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },
  };
}

exports.testimonials = createCRUD(Testimonial);
exports.partners = createCRUD(Partner);
exports.faqs = createCRUD(FAQ);
exports.team = createCRUD(TeamMember);
exports.awards = createCRUD(Award);
