const Workspace = require("../models/Workspace");
const { broadcast } = require("../sseManager");

exports.getWorkspaces = async (req, res) => {
  try {
    const { area, minSeats, maxBudget, city, featured, type } = req.query;
    const filter = { isAvailable: true };

    if (area) filter.area = { $regex: area, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (minSeats) filter.seats = { $gte: Number(minSeats) };
    if (maxBudget) filter.pricePerSeat = { $lte: Number(maxBudget) };
    if (featured === "true") filter.isFeatured = true;
    if (type) filter.type = { $in: Array.isArray(type) ? type : [type] };

    const workspaces = await Workspace.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).lean();
    if (!workspace) return res.status(404).json({ message: "Not found" });
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createWorkspace = async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => f.path) : [];
    const body = { ...req.body };
    if (typeof body.amenities === "string") {
      body.amenities = [body.amenities];
    }
    if (typeof body.type === "string") {
      body.type = [body.type];
    }
    const workspace = await Workspace.create({ ...body, images });
    broadcast("workspace", { action: "created", data: workspace });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
};

exports.updateWorkspace = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle amenities & type (may come as string or array from FormData)
    if (typeof updates.amenities === "string") {
      updates.amenities = [updates.amenities];
    }
    if (typeof updates.type === "string") {
      updates.type = [updates.type];
    }

    // Handle images: keep existing + add new uploads
    const existingImages = req.body.existingImages
      ? Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages]
      : [];
    const newImages = req.files ? req.files.map((f) => f.path) : [];
    updates.images = [...existingImages, ...newImages];
    delete updates.existingImages;

    const workspace = await Workspace.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!workspace) return res.status(404).json({ message: "Not found" });
    broadcast("workspace", { action: "updated", data: workspace });
    res.json(workspace);
  } catch (err) {
    res.status(400).json({ message: "Update error", error: err.message });
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Not found" });
    broadcast("workspace", { action: "deleted", data: { _id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
