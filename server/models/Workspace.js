const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    area: { type: String, required: true, trim: true, index: true },
    floor: { type: String, default: "" },
    squareFeet: { type: Number, default: 0 },
    seats: { type: Number, required: true, index: true },
    pricePerSeat: { type: Number, required: true, index: true },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String }],
    type: [{
      type: String,
      enum: ["Private Office", "Meeting Rooms", "Dedicated Desks", "Virtual Office", "Training Room"],
    }],
    isAvailable: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

workspaceSchema.index({ city: 1, area: 1, seats: 1, pricePerSeat: 1 });

module.exports = mongoose.model("Workspace", workspaceSchema);
