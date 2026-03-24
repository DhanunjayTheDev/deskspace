import { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2, Phone, MessageSquare, Search } from "lucide-react";
import api from "../lib/api";
import type { Lead } from "../types";
import StatusDropdown from "../components/StatusDropdown";
import LeadModal from "../components/LeadModal";
import { useSSEContext } from "../context/SSEContext";
import { useToast } from "../context/ToastContext";

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q)
    );
  }, [leads, search]);
  const { subscribe } = useSSEContext();

  const fetchLeads = useCallback(async () => {
    try {
      const { data } = await api.get("/leads");
      setLeads(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Real-time lead updates via SSE
  useEffect(() => {
    const unsub = subscribe("lead", ({ action, data }) => {
      const lead = data as Lead;
      setLeads((prev) => {
        if (action === "created") {
          // add to top if not already present
          if (prev.some((l) => l._id === lead._id)) return prev;
          return [lead, ...prev];
        }
        if (action === "updated") {
          return prev.map((l) => (l._id === lead._id ? { ...l, ...lead } : l));
        }
        return prev;
      });
      // Keep modal in sync if it's open for this lead
      if (action === "updated") {
        setSelectedLead((prev) =>
          prev?._id === lead._id ? { ...prev, ...lead } : prev
        );
      }
    });
    return unsub;
  }, [subscribe]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { data } = await api.patch(`/leads/${id}`, { status });
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, ...data } : l)));
      setSelectedLead((prev) => (prev?._id === id ? { ...prev, ...data } : prev));
      const label = status.charAt(0).toUpperCase() + status.slice(1);
      toast.success(`Lead marked as ${label}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update status";
      toast.error(msg);
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const { data } = await api.patch(`/leads/${id}`, { notes: notesText });
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, ...data } : l)));
      setEditingNotes(null);
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} of {leads.length} total leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 w-52"
            />
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No leads yet. They'll appear here once users submit enquiries.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Workspace</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Seats</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((lead) => {
                  const wsName = lead.workspaceId?.title || lead.workspaceName || "—";
                  return (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[180px] truncate">
                        {wsName}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          {lead.workspaceType || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{lead.seatsRequired}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusDropdown
                          value={lead.status}
                          onChange={(val) => updateStatus(lead._id, val)}
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {editingNotes === lead._id ? (
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-400 w-36"
                              placeholder="Add notes..."
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveNotes(lead._id);
                                if (e.key === "Escape") setEditingNotes(null);
                              }}
                            />
                            <button
                              onClick={() => saveNotes(lead._id)}
                              className="text-xs text-primary-600 font-medium hover:underline"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingNotes(lead._id);
                              setNotesText(lead.notes || "");
                            }}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {lead.notes ? (
                              <span className="text-gray-600 max-w-[120px] truncate">{lead.notes}</span>
                            ) : (
                              "Add note"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      <LeadModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={(id, status) => {
          updateStatus(id, status);
          setSelectedLead((prev) => (prev ? { ...prev, status: status as Lead["status"] } : prev));
        }}
      />
    </div>
  );
}
