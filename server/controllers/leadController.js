const Lead = require("../models/Lead");
const { broadcast } = require("../sseManager");

exports.createLead = async (req, res) => {
  try {
    const { name, phone, workspaceId, workspaceName, seatsRequired } = req.body;

    if (!name || !phone || !workspaceId || !seatsRequired) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Lead.findOne({ phone, workspaceId });
    if (existing) {
      return res.status(200).json({ message: "Lead already exists", lead: existing });
    }

    const lead = await Lead.create({ name, phone, workspaceId, workspaceName: workspaceName || "", seatsRequired });
    broadcast("lead", { action: "created", data: lead });
    res.status(201).json(lead);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: "Lead already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("workspaceId", "title area city")
      .sort({ createdAt: -1 })
      .lean();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updates = {};
    if (status) {
      if (!["new", "contacted", "converted"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      updates.status = status;
    }
    if (notes !== undefined) updates.notes = notes;

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    broadcast("lead", { action: "updated", data: lead });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newLeadsToday = await Lead.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const convertedLeads = await Lead.countDocuments({ status: "converted" });
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    res.json({ totalLeads, newLeadsToday, conversionRate: Number(conversionRate) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
