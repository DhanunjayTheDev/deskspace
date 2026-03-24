import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, MapPin, Users, Eye, EyeOff, Star, Search } from "lucide-react";
import api from "../lib/api";
import type { Workspace } from "../types";
import { useSSEContext } from "../context/SSEContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { confirm, dialogProps } = useConfirm();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        w.area.toLowerCase().includes(q)
    );
  }, [workspaces, search]);
  const { subscribe } = useSSEContext();

  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get("/workspaces");
      setWorkspaces(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Real-time workspace updates via SSE
  useEffect(() => {
    const unsub = subscribe("workspace", ({ action, data }) => {
      const ws = data as Workspace;
      setWorkspaces((prev) => {
        if (action === "created") {
          if (prev.some((w) => w._id === ws._id)) return prev;
          return [ws, ...prev];
        }
        if (action === "updated") {
          return prev.map((w) => (w._id === ws._id ? { ...w, ...ws } : w));
        }
        if (action === "deleted") {
          return prev.filter((w) => w._id !== (data as { _id: string })._id);
        }
        return prev;
      });
    });
    return unsub;
  }, [subscribe]);

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete Workspace",
      message: `Delete "${title}"? This cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    setDeleting(id);
    try {
      await api.delete(`/workspaces/${id}`);
      setWorkspaces((prev) => prev.filter((w) => w._id !== id));
      toast.success(`"${title}" deleted`);
    } catch {
      toast.error("Failed to delete workspace");
    } finally {
      setDeleting(null);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} of {workspaces.length} workspaces</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, city…"
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 w-56"
              />
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <Link
            to="/workspaces/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Workspace
          </Link>
        </div>
      </div>

      {workspaces.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No workspaces yet. Add your first one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Workspace</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Area</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Seats</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Price/Seat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {w.images[0] ? (
                          <img
                            src={w.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{w.title}</p>
                          <p className="text-xs text-gray-400 truncate md:hidden">
                            {w.area}, {w.city}
                          </p>
                        </div>
                        {w.isFeatured && (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {w.area}, {w.city}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(w.type && w.type.length > 0 ? w.type : ["Private Office"]).map((t) => (
                          <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-3.5 h-3.5" /> {w.seats}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 hidden sm:table-cell">
                      ₹{w.pricePerSeat.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      {w.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                          <Eye className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/workspaces/${w._id}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(w._id, w.title)}
                          disabled={deleting === w._id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === w._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
