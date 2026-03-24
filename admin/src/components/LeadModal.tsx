import { useEffect } from "react";
import {
  X,
  Phone,
  MapPin,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import type { Lead } from "../types";
import StatusDropdown from "./StatusDropdown";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function LeadModal({ lead, onClose, onStatusChange }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!lead) return null;

  const wsName = lead.workspaceId?.title || lead.workspaceName || "—";
  const wsLocation = lead.workspaceId
    ? `${lead.workspaceId.area}, ${lead.workspaceId.city}`
    : null;

  const formattedDate = new Date(lead.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{lead.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Lead Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors -mr-1"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Status</span>
            <StatusDropdown
              value={lead.status}
              onChange={(val) => onStatusChange(lead._id, val)}
            />
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Phone</span>
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
            >
              <Phone className="w-4 h-4" />
              {lead.phone}
            </a>
          </div>

          {/* Workspace */}
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-gray-500 font-medium shrink-0">
              Workspace
            </span>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{wsName}</p>
              {wsLocation && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center justify-end gap-1">
                  <MapPin className="w-3 h-3" />
                  {wsLocation}
                </p>
              )}
            </div>
          </div>

          {/* Workspace Type */}
          {lead.workspaceType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">
                Workspace Type
              </span>
              <span className="text-sm font-semibold text-gray-900">{lead.workspaceType}</span>
            </div>
          )}

          {/* Seats */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Seats Required
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <Users className="w-4 h-4 text-gray-400" />
              {lead.seatsRequired}{" "}
              <span className="text-gray-400 font-normal">seat{lead.seatsRequired !== 1 ? "s" : ""}</span>
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Submitted</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              {formattedDate}
            </span>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                <MessageSquare className="w-3.5 h-3.5" /> Notes
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                {lead.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 pt-2">
          <a
            href={`tel:${lead.phone}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-200 transition-all"
          >
            <Phone className="w-4 h-4" />
            Call {lead.name}
          </a>
        </div>
      </div>
    </div>
  );
}
