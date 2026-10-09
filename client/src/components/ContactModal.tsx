import { useState } from "react";
import { Building2, Loader2, Phone, User, Users } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { leadApi } from "../services/api";
import type { Workspace } from "../types/workspace";
import CustomSelect from "./CustomSelect";
import Sheet from "./ui/Sheet";
import Button from "./ui/Button";
import { cn } from "../lib/utils";

interface Props {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

const inputClass =
  "h-12 w-full rounded-xl border border-line-strong bg-surface pl-10 pr-3 text-sm text-fg " +
  "placeholder:text-subtle transition-colors duration-160 ease-out " +
  "md:hover:border-line-strong focus-visible:border-brand";

export default function ContactModal({
  workspace,
  isOpen,
  onClose,
  whatsappNumber,
}: Props) {
  const [form, setForm] = useState({ name: "", phone: "", seats: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.seats.trim()) {
      setError("Name, phone and seats are required.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      await leadApi.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        workspaceId: workspace._id,
        workspaceName: workspace.title,
        workspaceType: form.type.trim(),
        seatsRequired: Number(form.seats),
      });

      const message = [
        "Hi, I am interested in:",
        `Workspace: ${workspace.title}`,
        `Area: ${workspace.area}, ${workspace.city}`,
        form.type ? `Type: ${form.type}` : null,
        `Seats: ${form.seats}`,
        `Name: ${form.name.trim()}`,
        `Phone: ${form.phone.trim()}`,
      ]
        .filter(Boolean)
        .join("\n");

      setForm({ name: "", phone: "", seats: "", type: "" });
      onClose();
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title="Get in touch"
      description="We'll continue the conversation on WhatsApp."
      footer={
        <Button
          variant="success"
          fullWidth
          size="lg"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <WhatsAppIcon className="h-5 w-5" />
              Continue on WhatsApp
            </>
          )}
        </Button>
      }
    >
      <div className="mb-4 rounded-xl bg-sunken p-3">
        <p className="line-clamp-1 text-sm font-semibold text-fg">
          {workspace.title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">
          {workspace.area}, {workspace.city} · ₹
          {workspace.pricePerSeat.toLocaleString("en-IN")}/seat
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            aria-label="Your name"
            className={inputClass}
          />
        </div>

        <div className="relative">
          <Phone
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
            }
            placeholder="10-digit phone number"
            aria-label="Phone number"
            className={inputClass}
          />
        </div>

        <div className="relative">
          <Users
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={form.seats}
            onChange={(e) => setForm({ ...form, seats: e.target.value })}
            placeholder="Seats required"
            aria-label="Seats required"
            className={inputClass}
          />
        </div>

        {workspace.type?.length > 0 && (
          <CustomSelect
            value={form.type}
            onChange={(val) => setForm({ ...form, type: val })}
            options={workspace.type}
            placeholder="Workspace type (optional)"
            label="Workspace type"
            icon={<Building2 className="h-4 w-4" />}
          />
        )}

        {error && (
          <p
            role="alert"
            className={cn(
              "rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700",
              "motion-safe:pop-in"
            )}
          >
            {error}
          </p>
        )}

        {/* Submits on Enter; the visible button lives in the sheet footer. */}
        <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
          Submit
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-subtle">
        Free consultation · No commitment
      </p>
    </Sheet>
  );
}
