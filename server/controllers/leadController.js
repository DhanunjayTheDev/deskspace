const Lead = require("../models/Lead");
const { broadcast } = require("../sseManager");

exports.createLead = async (req, res) => {
  try {
    const { name, phone, workspaceId, workspaceName, workspaceType, seatsRequired } = req.body;

    if (!name || !phone || !workspaceId || !seatsRequired) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Lead.findOne({ phone, workspaceId });
    if (existing) {
      return res.status(200).json({ message: "Lead already exists", lead: existing });
    }

    const lead = await Lead.create({ name, phone, workspaceId, workspaceName: workspaceName || "", workspaceType: workspaceType || "", seatsRequired });
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

    // Status distribution
    const statusCountsRaw = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = { new: 0, contacted: 0, converted: 0 };
    statusCountsRaw.forEach(({ _id, count }) => {
      if (_id in statusCounts) statusCounts[_id] = count;
    });

    // Leads over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const dailyRaw = await Lead.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // Fill in all 7 days (even days with 0 leads)
    const leadsByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = dailyRaw.find((r) => r._id === key);
      leadsByDay.push({
        date: key,
        day: d.toLocaleDateString("en-IN", { weekday: "short" }),
        count: found ? found.count : 0,
      });
    }

    // Workspace type distribution
    const typeDistributionRaw = await Lead.aggregate([
      { $match: { workspaceType: { $ne: "" } } },
      { $group: { _id: "$workspaceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const typeDistribution = typeDistributionRaw.map((r) => ({
      name: r._id,
      value: r.count,
    }));

    // Top workspaces by lead count
    const topWorkspacesRaw = await Lead.aggregate([
      {
        $group: {
          _id: "$workspaceName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const topWorkspaces = topWorkspacesRaw.map((r) => ({
      name: r._id || "Unknown",
      leads: r.count,
    }));

    res.json({
      totalLeads,
      newLeadsToday,
      conversionRate: Number(conversionRate),
      statusCounts,
      leadsByDay,
      typeDistribution,
      topWorkspaces,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
