import { X, MapPin, DollarSign, Users, Layers, Grid3x3, Zap, Star } from "lucide-react";
import { createPortal } from "react-dom";
import type { Workspace } from "../types";

interface WorkspaceDetailModalProps {
  open: boolean;
  workspace: Workspace | null;
  onClose: () => void;
}

export default function WorkspaceDetailModal({ open, workspace, onClose }: WorkspaceDetailModalProps) {
  if (!open || !workspace) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] z-10 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 flex items-start justify-between px-6 py-5 z-10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{workspace.title}</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {workspace.area}, {workspace.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-primary">
          {/* Gallery */}
          {workspace.images.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {workspace.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${workspace.title} ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-2xl border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Key Info Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Total Seats
                </p>
                <p className="text-lg font-bold text-blue-900">{workspace.seats}</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100">
                <p className="text-xs text-amber-600 font-medium mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Price/Seat
                </p>
                <p className="text-lg font-bold text-amber-900">₹{workspace.pricePerSeat.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100">
                <p className="text-xs text-purple-600 font-medium mb-1 flex items-center gap-1">
                  <Grid3x3 className="w-3.5 h-3.5" /> Sq. Feet
                </p>
                <p className="text-lg font-bold text-purple-900">{workspace.squareFeet.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Location Details</h3>
            <div className="space-y-2">
              <div className="flex gap-3">
                <span className="text-sm font-medium text-gray-600 w-20">Address:</span>
                <span className="text-sm text-gray-900">{workspace.address}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-medium text-gray-600 w-20">Floor:</span>
                <span className="text-sm text-gray-900">{workspace.floor || "—"}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-medium text-gray-600 w-20">City:</span>
                <span className="text-sm text-gray-900">{workspace.city}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-medium text-gray-600 w-20">Area:</span>
                <span className="text-sm text-gray-900">{workspace.area}</span>
              </div>
            </div>
          </div>

          {/* Workspace Types */}
          {workspace.type.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
                <Layers className="w-4 h-4" /> Workspace Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {workspace.type.map((t) => (
                  <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-full font-medium border border-blue-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {workspace.amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
                <Zap className="w-4 h-4" /> Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {workspace.amenities.map((a) => (
                  <div key={a} className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg border border-green-100 font-medium">
                    ✓ {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status & Featured */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              <div className={`text-xs px-3 py-1.5 rounded-full font-medium border ${workspace.isAvailable ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                {workspace.isAvailable ? "✓ Available" : "✗ Not Available"}
              </div>
              {workspace.isFeatured && (
                <div className="text-xs px-3 py-1.5 rounded-full font-medium border bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> Featured
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Created:</span> {new Date(workspace.createdAt).toLocaleDateString("en-IN")}
              {" • "}
              <span className="font-medium">Updated:</span> {new Date(workspace.updatedAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-white bg-primary-600 hover:bg-primary-700 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
