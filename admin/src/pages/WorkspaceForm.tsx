import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import api from "../lib/api";

const WORKSPACE_TYPES = [
  "Private Office",
  "Meeting Rooms",
  "Dedicated Desks",
  "Virtual Office",
  "Training Room",
];

const AMENITY_OPTIONS = [
  "WiFi", "Parking", "Cafeteria", "Power Backup", "Security",
  "Printer", "Monitor", "AC", "Reception", "Meeting Room",
  "Phone Booth", "Locker", "CCTV", "Pantry",
];

interface FormData {
  title: string;
  address: string;
  city: string;
  area: string;
  floor: string;
  squareFeet: string;
  seats: string;
  pricePerSeat: string;
  type: string[];
  amenities: string[];
  isAvailable: boolean;
  isFeatured: boolean;
}

const emptyForm: FormData = {
  title: "",
  address: "",
  city: "",
  area: "",
  floor: "",
  squareFeet: "",
  seats: "",
  pricePerSeat: "",
  type: [],
  amenities: [],
  isAvailable: true,
  isFeatured: false,
};

export default function WorkspaceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(emptyForm);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/workspaces/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title,
          address: data.address,
          city: data.city,
          area: data.area,
          floor: data.floor || "",
          squareFeet: String(data.squareFeet || ""),
          seats: String(data.seats),
          pricePerSeat: String(data.pricePerSeat),
          type: data.type || [],
          amenities: data.amenities || [],
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
        });
        setExistingImages(data.images || []);
      })
      .catch(() => setError("Workspace not found"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateField = (key: keyof FormData, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.address || !form.city || !form.area || !form.seats || !form.pricePerSeat) {
      setError("Please fill all required fields");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("area", form.area);
      fd.append("floor", form.floor);
      fd.append("squareFeet", form.squareFeet || "0");
      fd.append("seats", form.seats);
      fd.append("pricePerSeat", form.pricePerSeat);
      form.type.forEach((t) => fd.append("type", t));
      fd.append("isAvailable", String(form.isAvailable));
      fd.append("isFeatured", String(form.isFeatured));

      form.amenities.forEach((a) => fd.append("amenities", a));

      // For edit, send existing images so server knows which to keep
      if (isEdit) {
        existingImages.forEach((img) => fd.append("existingImages", img));
      }

      files.forEach((f) => fd.append("images", f));

      if (isEdit) {
        await api.put(`/workspaces/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/workspaces", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/workspaces");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to save workspace";
      setError(msg);
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl">
      <Link
        to="/workspaces"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Workspaces
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Workspace" : "Add Workspace"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Skyline Hub – Premium Coworking"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Full street address"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Type</label>
            <div className="flex flex-wrap gap-2">
              {WORKSPACE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      type: prev.type.includes(t)
                        ? prev.type.filter((x) => x !== t)
                        : [...prev.type, t],
                    }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    form.type.includes(t)
                      ? "bg-primary-50 border-primary-300 text-primary-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {form.type.includes(t) && <span className="mr-1">✓</span>}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
              <input
                value={form.area}
                onChange={(e) => updateField("area", e.target.value)}
                placeholder="Area / Locality"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                value={form.floor}
                onChange={(e) => updateField("floor", e.target.value)}
                placeholder="e.g. 4th"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sq. Feet</label>
              <input
                type="number"
                value={form.squareFeet}
                onChange={(e) => updateField("squareFeet", e.target.value)}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats *</label>
              <input
                type="number"
                value={form.seats}
                onChange={(e) => updateField("seats", e.target.value)}
                placeholder="0"
                min={1}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Seat (₹) *</label>
            <input
              type="number"
              value={form.pricePerSeat}
              onChange={(e) => updateField("pricePerSeat", e.target.value)}
              placeholder="0"
              min={0}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  form.amenities.includes(a)
                    ? "bg-primary-50 border-primary-300 text-primary-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {form.amenities.includes(a) && <span className="mr-1">✓</span>}
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Images</h2>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New files preview */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map((f, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    className="w-full h-20 object-cover rounded-lg border border-primary-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-[10px] bg-primary-600 text-white px-1 rounded">
                    New
                  </span>
                </div>
              ))}
            </div>
          )}

          <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Click to upload images</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP up to 10 files</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </section>

        {/* Toggles */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Visibility</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => updateField("isAvailable", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Available (visible to users)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => updateField("isFeatured", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Featured (show on homepage)</span>
          </label>
        </section>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isEdit ? "Update Workspace" : "Create Workspace"}
          </button>
          <Link
            to="/workspaces"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
