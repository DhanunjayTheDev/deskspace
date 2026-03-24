const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    workspaceName: { type: String, default: "" },
    workspaceType: { type: String, default: "" },
    seatsRequired: { type: Number, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

leadSchema.index({ phone: 1, workspaceId: 1 }, { unique: true });

module.exports = mongoose.model("Lead", leadSchema);
