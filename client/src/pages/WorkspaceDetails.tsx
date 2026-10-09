import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  ConciergeBell,
  IndianRupee,
  Maximize2,
  MapPin,
  Phone,
  Presentation,
  Printer,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Users,
  UtensilsCrossed,
  Wifi,
  Zap,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { workspaceApi } from "../services/api";
import ContactModal from "../components/ContactModal";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";
import Button from "../components/ui/Button";
import { cn } from "../lib/utils";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919666120770";
const TEL_HREF = `tel:${WHATSAPP_NUMBER.startsWith("91") ? `+${WHATSAPP_NUMBER}` : `+91${WHATSAPP_NUMBER}`}`;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=900&fit=crop";

// Matched as substrings against the amenity label, most specific first so
// "Meeting & Conference Rooms" resolves before the generic fallback.
const amenityIcons: [string, React.ElementType][] = [
  ["internet", Wifi],
  ["wi-fi", Wifi],
  ["wifi", Wifi],
  ["tea & coffee", Coffee],
  ["coffee", Coffee],
  ["air-condition", Snowflake],
  ["power backup", Zap],
  ["printing", Printer],
  ["scanning", Printer],
  ["housekeeping", Sparkles],
  ["meeting", Presentation],
  ["conference", Presentation],
  ["pantry", UtensilsCrossed],
  ["breakout", UtensilsCrossed],
  ["reception", ConciergeBell],
  ["visitor", ConciergeBell],
  ["security", ShieldCheck],
  ["cctv", ShieldCheck],
  ["dedicated desk", Clock],
  ["24/7", Clock],
  ["parking", Car],
];

function getAmenityIcon(amenity: string) {
  const key = amenity.toLowerCase();
  for (const [needle, Icon] of amenityIcons) {
    if (key.includes(needle)) return Icon;
  }
  return Check;
}

export default function WorkspaceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { data: workspace, loading, error } = useFetch(
    () => workspaceApi.getById(id!),
    [id]
  );

  // The gallery is a native scroll-snap row, so the browser owns the momentum
  // and rubber-banding. We only read back which slide settled, to light the dot.
  const onGalleryScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;
    setImgIdx(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  const scrollToImage = useCallback((i: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setImgIdx(0);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-header px-safe">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="skeleton mb-6 h-5 w-32 rounded-md" />
          <div className="skeleton mb-8 aspect-[4/3] rounded-2xl sm:aspect-[16/9]" />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <div className="skeleton h-8 w-2/3 rounded-md" />
              <div className="skeleton h-5 w-1/2 rounded-md" />
              <div className="skeleton h-40 rounded-2xl" />
            </div>
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="pt-header flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-fg">
          Workspace not found
        </h1>
        <p className="mt-2 max-w-sm text-muted">
          This listing may have been removed or the link is out of date.
        </p>
        <Button to="/workspaces" className="mt-6">
          Browse workspaces
        </Button>
      </div>
    );
  }

  const images = workspace.images.length > 0 ? workspace.images : [FALLBACK_IMAGE];

  const stats = [
    { icon: Users, label: "Seats", value: String(workspace.seats) },
    {
      icon: IndianRupee,
      label: "Per seat",
      value: `₹${workspace.pricePerSeat.toLocaleString("en-IN")}`,
    },
    { icon: Maximize2, label: "Area", value: `${workspace.squareFeet} sqft` },
    { icon: Building, label: "Floor", value: workspace.floor || "—" },
  ];

  return (
    <div className="px-safe">
      {/* Back control sits above the gallery, clear of the floating header. */}
      <div className="mt-header mx-auto max-w-5xl px-4 pt-3 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="press inline-flex items-center gap-1.5 rounded-full bg-elevated py-2 pl-2.5 pr-4 text-sm font-medium text-fg transition-colors duration-160 ease-out md:hover:bg-line-strong"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Gallery */}
      <div className="relative mx-auto mt-3 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          ref={galleryRef}
          onScroll={onGalleryScroll}
          className="snap-row aspect-[4/3] w-full overflow-hidden rounded-2xl bg-elevated sm:aspect-[16/9]"
        >
          {images.map((src, i) => (
            <div key={src + i} className="snap-item h-full w-full">
              <img
                src={src}
                alt={`${workspace.title} photo ${i + 1} of ${images.length}`}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink-950/45 px-2.5 py-2 backdrop-blur">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToImage(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-250 ease-out",
                    i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToImage(Math.max(0, imgIdx - 1))}
              disabled={imgIdx === 0}
              aria-label="Previous photo"
              className="press absolute left-8 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow-pop backdrop-blur disabled:opacity-0 md:flex lg:left-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollToImage(Math.min(images.length - 1, imgIdx + 1))}
              disabled={imgIdx === images.length - 1}
              aria-label="Next photo"
              className="press absolute right-8 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow-pop backdrop-blur disabled:opacity-0 md:flex lg:right-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {workspace.isFeatured && (
          <span
            className="absolute right-4 rounded-lg bg-accent-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white md:top-4"
            style={{ top: "calc(var(--safe-top) + 0.75rem)" }}
          >
            Featured
          </span>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
        <Link
          to="/workspaces"
          className="press mt-6 hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-160 ease-out md:inline-flex md:hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to workspaces
        </Link>

        <div className="grid gap-8 pt-6 md:grid-cols-3 md:gap-10">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-fg sm:text-3xl">
              {workspace.title}
            </h1>

            <p className="mt-2 flex items-start gap-1.5 text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
              <span>
                {workspace.address}, {workspace.area}, {workspace.city}
              </span>
            </p>

            {workspace.type?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {workspace.type.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-xs font-semibold text-brand-soft-fg"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-sunken p-4">
                  <s.icon className="mb-2 h-5 w-5 text-brand" aria-hidden="true" />
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
                    {s.label}
                  </dt>
                  <dd className="mt-0.5 text-lg font-bold tracking-tight text-fg">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            {workspace.amenities.length > 0 && (
              <section className="mt-9">
                <h2 className="text-lg font-bold tracking-tight text-fg">
                  What's included
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Verified on site before this listing went live.
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {workspace.amenities.map((a) => {
                    const Icon = getAmenityIcon(a);
                    return (
                      <li
                        key={a}
                        className="flex items-center gap-3 rounded-xl bg-sunken px-4 py-3 text-sm text-fg"
                      >
                        <Icon
                          className="h-4 w-4 shrink-0 text-brand"
                          aria-hidden="true"
                        />
                        <span className="min-w-0">{a}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          {/* Desktop booking card. On phones the same actions live in the fixed
              bar below, so this is hidden rather than duplicated inline. */}
          <aside className="hidden md:block">
            <div className="sticky top-header-gap rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                Starting at
              </p>
              <p className="mt-1 flex items-baseline gap-1">
                <IndianRupee className="h-6 w-6 self-center text-fg" aria-hidden="true" />
                <span className="text-3xl font-extrabold tracking-tight text-fg">
                  {workspace.pricePerSeat.toLocaleString("en-IN")}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-subtle">per seat / month</p>

              <div className="mt-6 space-y-2.5">
                <Button
                  variant="success"
                  fullWidth
                  size="lg"
                  onClick={() => setModalOpen(true)}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Contact on WhatsApp
                </Button>
                <Button href={TEL_HREF} variant="outline" fullWidth>
                  <Phone className="h-4 w-4" />
                  Call us
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-subtle">
                Free consultation · No commitment
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Phone action bar, docked above the tab bar. */}
      <div
        className="fixed inset-x-0 z-40 border-t border-line bar-blur px-4 py-3 px-safe md:hidden"
        style={{ bottom: "calc(var(--tabbar-h) + var(--safe-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline text-lg font-extrabold tracking-tight text-fg">
              <IndianRupee className="h-4 w-4 self-center" aria-hidden="true" />
              {workspace.pricePerSeat.toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-medium text-subtle">/seat</span>
            </p>
          </div>
          <a
            href={TEL_HREF}
            aria-label="Call us"
            className="press flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface text-fg"
          >
            <Phone className="h-5 w-5" />
          </a>
          <Button variant="success" onClick={() => setModalOpen(true)} className="flex-1">
            <WhatsAppIcon className="h-5 w-5" />
            Enquire
          </Button>
        </div>
      </div>

      {/* Clears the fixed action bar so the last section isn't covered. */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      <ContactModal
        workspace={workspace}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        whatsappNumber={WHATSAPP_NUMBER}
      />
    </div>
  );
}
