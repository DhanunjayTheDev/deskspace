import { useState } from "react";
import { Check, Mail, Map, MapPin, Phone, Send } from "lucide-react";
import Reveal from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import CustomSelect from "../components/CustomSelect";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";
import { leadApi } from "../services/api";
import { cn } from "../lib/utils";

const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919666120770";
const formattedPhone = phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`;
const displayPhone = `+91 ${phoneNumber.slice(-10, -5)} ${phoneNumber.slice(-5)}`;

const officeAddress = "8th Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad 500081";
const officeEmail = "hello@deskplace.in";
const supportEmail = "support@deskplace.in";

const subjects = [
  "General enquiry",
  "Workspace booking",
  "Partnership / listing",
  "Technical support",
  "Billing & payments",
  "Feedback",
];

const channels = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    description: "Instant chat with our team",
    detail: "Usually replies in minutes",
    href: `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hi, I'm interested in DeskPlace workspaces.")}`,
    cta: "Start chat",
    accent: "bg-success-600",
    external: true,
  },
  {
    icon: Phone,
    title: "Call us",
    description: "Mon–Fri, 9 AM – 7 PM IST",
    detail: displayPhone,
    href: `tel:${formattedPhone}`,
    cta: "Call now",
    accent: "bg-brand",
    external: false,
  },
  {
    icon: Mail,
    title: "Email us",
    description: "We reply within 24 hours",
    detail: `${officeEmail} · ${supportEmail}`,
    href: `mailto:${officeEmail}`,
    cta: "Send email",
    // Inverts with the theme: dark chip in light mode, light chip in dark.
    accent: "bg-fg text-surface",
    external: false,
  },
  {
    icon: MapPin,
    title: "Visit the office",
    description: "Drop by for a coffee and a tour",
    detail: officeAddress,
    href: "https://maps.google.com/?q=Cyber+Towers+HITEC+City+Hyderabad",
    cta: "Get directions",
    accent: "bg-accent-500",
    external: true,
  },
];

const quickAnswers = [
  { q: "How do I book a workspace?", a: "Browse listings, pick a space, then book instantly or schedule a tour." },
  { q: "What's the cancellation policy?", a: "Free cancellation up to 24 hours before check-in for most spaces." },
  { q: "Are workspaces verified?", a: "Yes every listing is personally verified by our team." },
  { q: "Can I modify my booking?", a: "Yes, contact support at least 24 hours before your booking." },
];

const inputClass =
  "h-12 w-full rounded-xl border bg-surface px-4 text-sm text-fg placeholder:text-subtle " +
  "transition-colors duration-160 ease-out";

type Errors = Record<string, string>;

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "That email doesn't look right";
    if (!form.phone.trim()) next.phone = "Phone is required";
    else if (form.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter at least 10 digits";
    if (!form.subject) next.subject = "Pick a subject";
    if (!form.message.trim()) next.message = "Message is required";
    else if (form.message.trim().length < 20)
      next.message = "Tell us a little more (20+ characters)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildWhatsAppMessage = () =>
    [
      "*New enquiry from deskplace.in*",
      "",
      `*Name:* ${form.name.trim()}`,
      `*Email:* ${form.email.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      `*Subject:* ${form.subject}`,
      "",
      "*Message:*",
      form.message.trim(),
    ].join("\n");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || sending) return;

    setSending(true);

    // The window is opened synchronously off the click so Safari and mobile
    // browsers don't treat it as an unsolicited popup; the lead is recorded
    // after, and a failure there must not cost the user their message.
    const chat = window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`,
      "_blank",
      "noopener,noreferrer"
    );

    try {
      await leadApi.create({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: `[${form.subject}] ${form.message.trim()}`,
      });
    } catch {
      // Ignored on purpose: WhatsApp is the delivery channel, the lead record
      // is a convenience.
    }

    // Popup blocked: fall back to navigating this tab to the chat.
    if (!chat) {
      window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        buildWhatsAppMessage()
      )}`;
    }

    setSending(false);
    setSubmitted(true);
  };

  const fieldBorder = (key: keyof typeof form) =>
    errors[key]
      ? "border-red-400 focus-visible:border-red-500"
      : "border-line-strong md:hover:border-line-strong focus-visible:border-brand";

  return (
    <>
      {/* Hero */}
      <section className="bg-ink-950 px-safe">
        <div className="mx-auto max-w-content px-4 pt-header pb-10 sm:px-6 sm:pb-16 lg:px-8">
          <div className="max-w-3xl pt-8 sm:pt-14">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              Get in touch
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Let's start a <span className="text-primary-300">conversation</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Questions about a space? Need help narrowing it down? Reach out on whichever
              channel suits you we answer fast.
            </p>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="relative z-10 -mt-6 px-4 px-safe sm:-mt-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {channels.map((c, i) => (
            <Reveal
              key={c.title}
              index={i}
              className="flex h-full flex-col rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line"
            >
              <span
                className={cn(
                  "mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white",
                  c.accent
                )}
              >
                <c.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-base font-bold tracking-tight text-fg">
                {c.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
              <p className="mt-2 flex-1 break-words text-sm font-medium text-fg">
                {c.detail}
              </p>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="press mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-elevated px-4 text-sm font-semibold text-fg transition-colors duration-160 ease-out md:hover:bg-line-strong"
              >
                {c.cta}
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section className="section-y px-safe">
        <div className="mx-auto grid max-w-content gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          {/* Form */}
          <Reveal className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-700">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-fg">
                  Opening WhatsApp
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-muted">
                  Your details are already typed out — just hit send in WhatsApp and
                  we'll reply within 24 hours.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    variant="success"
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                      buildWhatsAppMessage()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Open the chat again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                      setSubmitted(false);
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-soft-fg">
                    Contact form
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-fg">
                    Send us a message
                  </h2>
                  <p className="mt-1.5 text-muted">
                    Fill this in and we'll open WhatsApp with your details ready to
                    send.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-fg"
                      >
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Jane Doe"
                        aria-invalid={!!errors.name}
                        className={cn(inputClass, fieldBorder("name"))}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-fg"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="jane@company.com"
                        aria-invalid={!!errors.email}
                        className={cn(inputClass, fieldBorder("email"))}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-fg"
                      >
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        aria-invalid={!!errors.phone}
                        className={cn(inputClass, fieldBorder("phone"))}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-fg">
                        Subject
                      </span>
                      <CustomSelect
                        value={form.subject}
                        onChange={(val) => set("subject", val)}
                        options={subjects}
                        placeholder="Select a topic"
                        label="Subject"
                        triggerClassName={cn(
                          errors.subject && "border-red-400"
                        )}
                      />
                      {errors.subject && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-fg"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Team size, preferred location, budget, move-in date…"
                      aria-invalid={!!errors.message}
                      className={cn(
                        "w-full resize-none rounded-xl border bg-surface px-4 py-3 text-sm text-fg placeholder:text-subtle transition-colors duration-160 ease-out",
                        fieldBorder("message")
                      )}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="success"
                    fullWidth
                    size="lg"
                    disabled={sending}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {sending ? "Opening WhatsApp…" : "Send via WhatsApp"}
                  </Button>

                  <p className="text-center text-xs text-subtle">
                    Opens a WhatsApp chat with your message pre-filled. Nothing is sent
                    until you press send there.
                  </p>
                </form>
              </>
            )}
          </Reveal>

          {/* Map */}
          <Reveal index={1} className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
            <div className="border-b border-line p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-fg">
                  <Map className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-fg">
                    Our location
                  </h2>
                  <p className="text-sm text-muted">HITEC City, Hyderabad</p>
                </div>
              </div>
              <address className="mt-4 not-italic text-sm leading-relaxed text-muted">
                8th Floor, Cyber Towers, HITEC City
                <br />
                Madhapur, Hyderabad, Telangana 500081
              </address>
            </div>

            <iframe
              title="DeskPlace office location"
              src="https://maps.google.com/maps?q=Cyber%20Towers%2C%20HITEC%20City%2C%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="aspect-[4/3] w-full border-0 lg:aspect-auto lg:h-[360px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="grid grid-cols-2 gap-3 border-t border-line bg-sunken p-4">
              <a
                href="https://maps.google.com/?q=Cyber+Towers+HITEC+City+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="press flex h-11 items-center justify-center gap-2 rounded-xl bg-surface text-sm font-semibold text-fg ring-1 ring-line-strong transition-colors duration-160 ease-out md:hover:bg-elevated"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Directions
              </a>
              <a
                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hi, I'd like to visit your office.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex h-11 items-center justify-center gap-2 rounded-xl bg-success-600 text-sm font-semibold text-white transition-colors duration-160 ease-out md:hover:bg-success-700"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Schedule visit
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick answers */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Quick help"
            title="Common questions"
            subtitle="Short answers to what people ask most."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickAnswers.map((item, i) => (
              <Reveal
                key={item.q}
                index={i}
                className="rounded-2xl bg-surface p-5 ring-1 ring-line"
              >
                <p className="font-semibold text-fg">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
