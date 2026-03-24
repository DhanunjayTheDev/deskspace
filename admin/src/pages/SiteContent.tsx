import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Star, Check } from "lucide-react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";

type Tab = "testimonials" | "partners" | "faqs";

/* ─── Types ─────────────────────────────────────────────── */
interface Testimonial {
  _id: string; name: string; role: string; company: string;
  photo: string; quote: string; rating: number; isActive: boolean; order: number;
}
interface Partner {
  _id: string; name: string; logo: string; website: string;
  isActive: boolean; order: number;
}
interface FAQ {
  _id: string; question: string; answer: string;
  isActive: boolean; order: number;
}

type Item = Testimonial | Partner | FAQ;

/* ─── Generic CRUD hook ──────────────────────────────────── */
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

/* ─── Small FormModal ────────────────────────────────────── */
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

/* ─── Field helpers ─────────────────────────────────────── */
const inp = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400";
const ta = `${inp} resize-none`;

/* ─── Testimonials Tab ──────────────────────────────────── */
function TestimonialsTab() {
  const { items, loading, create, update, remove } = useContent<Testimonial>("testimonials");
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { confirm, dialogProps } = useConfirm();

  const empty: Partial<Testimonial> = { name: "", role: "", company: "", photo: "", quote: "", rating: 5, isActive: true, order: 0 };
  const open = (t?: Testimonial) => setEditing(t ?? empty);
  const close = () => setEditing(null);

  const save = async () => {
    if (!editing?.name || !editing?.quote) return toast.warning("Name and quote are required");
    setSaving(true);
    try {
      if ((editing as Testimonial)._id) {
        await update((editing as Testimonial)._id, editing);
        toast.success("Testimonial updated");
      } else {
        await create(editing);
        toast.success("Testimonial added");
      }
      close();
    } catch { toast.error("Failed to save testimonial"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "Delete Testimonial", message: "Delete this testimonial? This cannot be undone." });
    if (!ok) return;
    try {
      await remove(id);
      toast.success("Testimonial deleted");
    } catch { toast.error("Failed to delete testimonial"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{items.length} testimonials</p>
        <button onClick={() => open()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div> : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t._id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              {t.photo && <img src={t.photo} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">"{t.quote}"</p>
                <div className="flex mt-1 gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => open(t)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-sm text-gray-400 py-8">No testimonials yet.</p>}
        </div>
      )}
      {editing !== null && (
        <Modal title={(editing as Testimonial)._id ? "Edit Testimonial" : "Add Testimonial"} onClose={close}>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Name *</label><input className={inp} value={editing.name ?? ""} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs font-medium text-gray-700 block mb-1">Role</label><input className={inp} value={editing.role ?? ""} onChange={e => setEditing(p => ({ ...p!, role: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-700 block mb-1">Company</label><input className={inp} value={editing.company ?? ""} onChange={e => setEditing(p => ({ ...p!, company: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Photo URL</label><input className={inp} value={editing.photo ?? ""} placeholder="https://..." onChange={e => setEditing(p => ({ ...p!, photo: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Quote *</label><textarea rows={3} className={ta} value={editing.quote ?? ""} onChange={e => setEditing(p => ({ ...p!, quote: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Rating</label>
              <div className="flex gap-1">{[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setEditing(p => ({ ...p!, rating: n }))} className={`w-8 h-8 rounded-lg text-sm font-medium ${(editing.rating ?? 5) >= n ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-400"}`}>{n}</button>
              ))}</div>
            </div>
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

/* ─── Partners Tab ──────────────────────────────────────── */
function PartnersTab() {
  const { items, loading, create, update, remove } = useContent<Partner>("partners");
  const [editing, setEditing] = useState<Partial<Partner> | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { confirm, dialogProps } = useConfirm();

  const empty: Partial<Partner> = { name: "", logo: "", website: "", isActive: true, order: 0 };
  const open = (p?: Partner) => setEditing(p ?? empty);
  const close = () => setEditing(null);

  const save = async () => {
    if (!editing?.name) return toast.warning("Name is required");
    setSaving(true);
    try {
      if ((editing as Partner)._id) {
        await update((editing as Partner)._id, editing);
        toast.success("Partner updated");
      } else {
        await create(editing);
        toast.success("Partner added");
      }
      close();
    } catch { toast.error("Failed to save partner"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "Delete Partner", message: "Delete this partner? This cannot be undone." });
    if (!ok) return;
    try {
      await remove(id);
      toast.success("Partner deleted");
    } catch { toast.error("Failed to delete partner"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{items.length} partners</p>
        <button onClick={() => open()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((p) => (
            <div key={p._id} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl relative group">
              {p.logo ? <img src={p.logo} alt={p.name} className="h-10 object-contain" /> : <div className="h-10 w-full bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No logo</div>}
              <p className="text-xs font-medium text-gray-700 text-center">{p.name}</p>
              {!p.isActive && <span className="text-xs text-gray-400">(hidden)</span>}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => open(p)} className="p-1 text-gray-400 hover:text-primary-600 bg-white rounded-lg shadow-sm"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(p._id)} className="p-1 text-gray-400 hover:text-red-600 bg-white rounded-lg shadow-sm"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-3 text-center text-sm text-gray-400 py-8">No partners yet.</p>}
        </div>
      )}
      {editing !== null && (
        <Modal title={(editing as Partner)._id ? "Edit Partner" : "Add Partner"} onClose={close}>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Company Name *</label><input className={inp} value={editing.name ?? ""} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Logo URL</label><input className={inp} value={editing.logo ?? ""} placeholder="https://..." onChange={e => setEditing(p => ({ ...p!, logo: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Website URL</label><input className={inp} value={editing.website ?? ""} placeholder="https://..." onChange={e => setEditing(p => ({ ...p!, website: e.target.value }))} /></div>
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

/* ─── FAQs Tab ──────────────────────────────────────────── */
function FAQsTab() {
  const { items, loading, create, update, remove } = useContent<FAQ>("faqs");
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { confirm, dialogProps } = useConfirm();

  const empty: Partial<FAQ> = { question: "", answer: "", isActive: true, order: 0 };
  const open = (f?: FAQ) => setEditing(f ?? empty);
  const close = () => setEditing(null);

  const save = async () => {
    if (!editing?.question || !editing?.answer) return toast.warning("Question and answer are required");
    setSaving(true);
    try {
      if ((editing as FAQ)._id) {
        await update((editing as FAQ)._id, editing);
        toast.success("FAQ updated");
      } else {
        await create(editing);
        toast.success("FAQ added");
      }
      close();
    } catch { toast.error("Failed to save FAQ"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: "Delete FAQ", message: "Delete this FAQ? This cannot be undone." });
    if (!ok) return;
    try {
      await remove(id);
      toast.success("FAQ deleted");
    } catch { toast.error("Failed to delete FAQ"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{items.length} FAQs</p>
        <button onClick={() => open()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div> : (
        <div className="space-y-2">
          {items.map((f, i) => (
            <div key={f._id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-400 mt-0.5 w-5 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{f.question}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{f.answer}</p>
                {!f.isActive && <span className="text-xs text-gray-400">(hidden)</span>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => open(f)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(f._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-sm text-gray-400 py-8">No FAQs yet.</p>}
        </div>
      )}
      {editing !== null && (
        <Modal title={(editing as FAQ)._id ? "Edit FAQ" : "Add FAQ"} onClose={close}>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Question *</label><input className={inp} value={editing.question ?? ""} onChange={e => setEditing(p => ({ ...p!, question: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Answer *</label><textarea rows={4} className={ta} value={editing.answer ?? ""} onChange={e => setEditing(p => ({ ...p!, answer: e.target.value }))} /></div>
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

/* ─── Main Page ─────────────────────────────────────────── */
const TABS: { id: Tab; label: string }[] = [
  { id: "testimonials", label: "Testimonials" },
  { id: "partners", label: "Trusted Partners" },
  { id: "faqs", label: "FAQs" },
];

export default function SiteContent() {
  const [tab, setTab] = useState<Tab>("testimonials");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-sm text-gray-500 mt-1">Manage testimonials, partners, and FAQs shown on the website</p>
      </div>

      {/* Tabs */}
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
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "partners" && <PartnersTab />}
        {tab === "faqs" && <FAQsTab />}
      </div>
    </div>
  );
}
