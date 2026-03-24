import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check, Trophy } from "lucide-react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";
import ImageUploadField from "../components/ImageUploadField";
import { uploadImage } from "../lib/uploadImage";

type Tab = "team" | "awards";

interface TeamMember {
  _id: string; name: string; role: string; bio: string;
  photo: string; isActive: boolean; order: number;
}
interface Award {
  _id: string; title: string; year: string; description: string;
  image: string; isActive: boolean; order: number;
}
type Item = TeamMember | Award;

function useContent<T extends Item>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/site/${endpoint}/all`);
      setItems(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [endpoint]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (body: Partial<T>) => {
    const { data } = await api.post(`/site/${endpoint}`, body);
    setItems((p) => [...p, data]);
  };
  const update = async (id: string, body: Partial<T>) => {
    const { data } = await api.put(`/site/${endpoint}/${id}`, body);
    setItems((p) => p.map((i) => (i._id === id ? data : i)));
  };
  const remove = async (id: string) => {
    await api.delete(`/site/${endpoint}/${id}`);
    setItems((p) => p.filter((i) => i._id !== id));
  };

  return { items, loading, create, update, remove };
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

const inp = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400";
const ta = `${inp} resize-none`;

/* ─── Team Tab ──────────────────────────────────────────── */
function TeamTab() {
  const { items, loading, create, update, remove } = useContent<TeamMember>("team");
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { confirm, dialogProps } = useConfirm();

  const empty: Partial<TeamMember> = { name: "", role: "", bio: "", photo: "", isActive: true, order: 0 };
  const open = (m?: TeamMember) => {
    if (m) {
      setEditing(m);
    } else {
      const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;
      setEditing({ ...empty, order: nextOrder });
    }
    setPendingFile(null);
  };
  const close = () => { setEditing(null); setPendingFile(null); };

  const save = async () => {
    if (!editing?.name || !editing?.role) return toast.warning("Name and role are required");
    setSaving(true);
    try {
      let body: Partial<TeamMember> = { ...editing };
      if (pendingFile) {
        const url = await uploadImage(pendingFile, "team");
        body = { ...body, photo: url };
      }
      if ((editing as TeamMember)._id) {
        await update((editing as TeamMember)._id, body);
        toast.success("Team member updated");
      } else {
        await create(body);
        toast.success("Team member added");
      }
      close();
    } catch { toast.error("Failed to save team member"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "Delete Team Member", message: "Delete this team member? This cannot be undone." });
    if (!ok) return;
    try {
      await remove(id);
      toast.success("Team member deleted");
    } catch { toast.error("Failed to delete team member"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{items.length} team members</p>
        <button onClick={() => open()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((m) => (
            <div key={m._id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              {m.photo
                ? <img src={m.photo} alt={m.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">{m.name[0]}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-primary-600 font-medium">{m.role}</p>
                {m.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.bio}</p>}
                {!m.isActive && <span className="text-xs text-gray-400">(hidden)</span>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => open(m)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(m._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-2 text-center text-sm text-gray-400 py-8">No team members yet.</p>}
        </div>
      )}
      {editing !== null && (
        <Modal title={(editing as TeamMember)._id ? "Edit Team Member" : "Add Team Member"} onClose={close}>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Name *</label><input className={inp} value={editing.name ?? ""} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Role / Designation *</label><input className={inp} value={editing.role ?? ""} placeholder="e.g. CEO & Co-Founder" onChange={e => setEditing(p => ({ ...p!, role: e.target.value }))} /></div>
            <ImageUploadField
              label="Photo"
              currentUrl={editing.photo}
              pendingFile={pendingFile}
              onFileChange={setPendingFile}
              onUrlClear={() => setEditing(p => ({ ...p!, photo: "" }))}
              rounded
            />
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Bio</label><textarea rows={3} className={ta} value={editing.bio ?? ""} onChange={e => setEditing(p => ({ ...p!, bio: e.target.value }))} /></div>
            <div className="flex gap-3">
              <div><label className="text-xs font-medium text-gray-700 block mb-1">Order</label><input type="number" className={inp} value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p!, order: Number(e.target.value) }))} /></div>
              <label className="flex items-center gap-2 cursor-pointer mt-5">
                <input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing(p => ({ ...p!, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
              </button>
              <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}

/* ─── Awards Tab ────────────────────────────────────────── */
function AwardsTab() {
  const { items, loading, create, update, remove } = useContent<Award>("awards");
  const [editing, setEditing] = useState<Partial<Award> | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { confirm, dialogProps } = useConfirm();

  const empty: Partial<Award> = { title: "", year: "", description: "", image: "", isActive: true, order: 0 };
  const open = (a?: Award) => {
    if (a) {
      setEditing(a);
    } else {
      const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;
      setEditing({ ...empty, order: nextOrder });
    }
    setPendingFile(null);
  };
  const close = () => { setEditing(null); setPendingFile(null); };

  const save = async () => {
    if (!editing?.title) return toast.warning("Title is required");
    setSaving(true);
    try {
      let body: Partial<Award> = { ...editing };
      if (pendingFile) {
        const url = await uploadImage(pendingFile, "award");
        body = { ...body, image: url };
      }
      if ((editing as Award)._id) {
        await update((editing as Award)._id, body);
        toast.success("Award updated");
      } else {
        await create(body);
        toast.success("Award added");
      }
      close();
    } catch { toast.error("Failed to save award"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "Delete Award", message: "Delete this award? This cannot be undone." });
    if (!ok) return;
    try {
      await remove(id);
      toast.success("Award deleted");
    } catch { toast.error("Failed to delete award"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{items.length} awards</p>
        <button onClick={() => open()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Add Award
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((a) => (
            <div key={a._id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              {a.image
                ? <img src={a.image} alt={a.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0"><Trophy className="w-6 h-6 text-white" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                {a.year && <p className="text-xs text-amber-600 font-medium">{a.year}</p>}
                {a.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>}
                {!a.isActive && <span className="text-xs text-gray-400">(hidden)</span>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => open(a)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(a._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-2 text-center text-sm text-gray-400 py-8">No awards yet.</p>}
        </div>
      )}
      {editing !== null && (
        <Modal title={(editing as Award)._id ? "Edit Award" : "Add Award"} onClose={close}>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Title *</label><input className={inp} value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs font-medium text-gray-700 block mb-1">Year</label><input className={inp} value={editing.year ?? ""} placeholder="2024" onChange={e => setEditing(p => ({ ...p!, year: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-700 block mb-1">Order</label><input type="number" className={inp} value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p!, order: Number(e.target.value) }))} /></div>
            </div>
            <ImageUploadField
              label="Award Image"
              currentUrl={editing.image}
              pendingFile={pendingFile}
              onFileChange={setPendingFile}
              onUrlClear={() => setEditing(p => ({ ...p!, image: "" }))}
            />
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Description</label><textarea rows={3} className={ta} value={editing.description ?? ""} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} /></div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing(p => ({ ...p!, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
              </button>
              <button onClick={close} className="px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
const TABS: { id: Tab; label: string }[] = [
  { id: "team", label: "Team Members" },
  { id: "awards", label: "Awards" },
];

export default function AboutContent() {
  const [tab, setTab] = useState<Tab>("team");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">About Content</h1>
        <p className="text-sm text-gray-500 mt-1">Manage team members and awards shown on the About page</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {tab === "team" && <TeamTab />}
        {tab === "awards" && <AwardsTab />}
      </div>
    </div>
  );
}
