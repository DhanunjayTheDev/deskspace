import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Headphones,
  LayoutGrid,
  Mail,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import HeroCarousel from "../components/HeroCarousel";
import WorkspaceCard from "../components/WorkspaceCard";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import StickyStack from "../components/ui/StickyStack";
// @ts-ignore - JS component from React Bits
import ScrollExpand from "../components/ScrollExpand";
import Reveal from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import CountUp from "../components/ui/CountUp";
import { staticTestimonials } from "../services/api";
import { amenitiesList, localities, workspaces } from "../data/workspaces";
import { cn } from "../lib/utils";

const featured = workspaces.filter((w) => w.isFeatured).slice(0, 6);

const partners = [
  "WeWork",
  "Awfis",
  "91springboard",
  "Innov8",
  "CoWrks",
  "BHIVE",
];

const impact = [
  { value: "250+", label: "Hyderabad workspaces", icon: Building2 },
  { value: "12,000+", label: "Professionals seated", icon: Users },
  { value: "98%", label: "Customer satisfaction", icon: Star },
  { value: "24 hrs", label: "Avg. response time", icon: Clock },
];

const features = [
  {
    icon: Sparkles,
    title: "Premium spaces",
    desc: "Handpicked workspaces with modern amenities and interiors worth showing up for.",
  },
  {
    icon: Shield,
    title: "Verified listings",
    desc: "Every workspace is personally verified for quality and authenticity before it goes live.",
  },
  {
    icon: Clock,
    title: "Instant booking",
    desc: "Get connected with workspace owners in minutes, not days.",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    desc: "A real team that helps you find the right space for how your team actually works.",
  },
];

const steps = [
  {
    step: "01",
    title: "Search & discover",
    desc: "Browse curated workspaces by city, budget, amenities and team size.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Compare & connect",
    desc: "View photos, pricing and availability, then message owners or book a tour.",
    icon: LayoutGrid,
  },
  {
    step: "03",
    title: "Book & move in",
    desc: "Secure your space on flexible terms and start working immediately.",
    icon: Shield,
  },
];

// `title` must match the canonical values in `workspaceTypes` the type filter
// compares exactly, so a casing drift here silently returns zero results.
const types = [
  { title: "Private Offices", desc: "Lockable, furnished offices for teams of 2–50+", icon: Building2, badge: "Popular" },
  { title: "Dedicated Desks", desc: "Your own desk in a shared office with 24/7 access", icon: LayoutGrid, badge: "Flexible" },
  { title: "Hot Desks", desc: "First-come, first-served seating in vibrant spaces", icon: Users, badge: "Budget" },
  { title: "Meeting Rooms", desc: "Hourly rooms with AV, whiteboards and fast Wi-Fi", icon: MessageSquare, badge: "On-demand" },
  { title: "Virtual Offices", desc: "Business address, mail handling, call forwarding", icon: Mail, badge: "Remote" },
  { title: "Event Spaces", desc: "Large venues for workshops, training and meetups", icon: Calendar, badge: "Groups" },
];

const faqs = [
  {
    id: "f1",
    q: "How does DeskPlace work?",
    a: "We connect you with verified workspace providers. Browse listings, compare options, and talk directly to owners to book your space.",
  },
  {
    id: "f2",
    q: "Are all listings verified?",
    a: "Yes. Every workspace is personally verified for quality, amenities and authenticity before it appears on the site.",
  },
  {
    id: "f3",
    q: "Can I book a meeting room for a few hours?",
    a: "Absolutely. Many spaces offer hourly meeting room bookings with instant confirmation.",
  },
  {
    id: "f4",
    q: "What's included in the price?",
    a: "Usually high-speed WiFi, meeting room access, 24/7 entry, reception and utilities. Check each listing for exact inclusions.",
  },
  {
    id: "f5",
    q: "Is there a minimum commitment?",
    a: "Terms run from hourly bookings to monthly contracts. Most spaces need no long-term commitment.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <>
      <HeroCarousel />

      {/* Partners. A ruled row of wordmarks rather than a scrolling strip of
          pills — the names read as a masthead credit line, and nothing moves
          while you are trying to read it. */}
      <section className="border-y border-line bg-sunken px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 py-8 lg:grid-cols-[auto_1fr] lg:gap-10 lg:py-9">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-subtle lg:max-w-[9rem]">
              Trusted by
              <br className="hidden lg:block" /> teams at
            </p>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {partners.map((name) => (
                <li
                  key={name}
                  className={cn(
                    "border-line py-3 text-center font-display text-xl tracking-tight text-muted",
                    // Hairline rules between cells, matching the column count
                    // at each breakpoint so no stray edge is ever left hanging.
                    "border-b [&:nth-last-child(-n+2)]:border-b-0",
                    "sm:[&:nth-last-child(-n+3)]:border-b-0",
                    "lg:border-b-0",
                    "[&:not(:nth-child(2n))]:border-r",
                    "sm:[&:not(:nth-child(3n))]:border-r sm:[&:nth-child(2n)]:border-r",
                    "lg:[&:not(:last-child)]:border-r lg:[&:nth-child(2n)]:border-r"
                  )}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Impact. The stat boxes are gone — the numbers now land over a frame
          that opens to full bleed as you scroll past it. */}
      <section className="bg-ink-950">
        <ScrollExpand
          useWindowScroll
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1800&q=80&fit=crop"
          alt="A workspace lounge in Hyderabad"
          title="Built around Hyderabad"
          scrollHint="Scroll"
          startWidth={62}
          startHeight={54}
          startRadius={28}
          mediaZoom={1.25}
          scrollDistance={1}
          holdDistance={0.25}
          overlayScrim={0.8}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Our impact
          </p>
          <dl className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {impact.map((item) => (
              <div key={item.label}>
                <dd className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <CountUp value={item.value} />
                </dd>
                <dt className="mt-1 text-xs text-white/60 sm:text-sm">{item.label}</dt>
              </div>
            ))}
          </dl>
        </ScrollExpand>
      </section>

      {/* Featured workspaces */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="Featured"
            title="Handpicked spaces"
            subtitle="Spaces our team would put their own desk in."
            action={
              <Link
                to="/workspaces"
                className="press hidden items-center gap-1.5 text-sm font-semibold text-brand-soft-fg sm:inline-flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          {/* Phone: a swipeable rail, the way a native app shows a shelf.
              Tablet and up: a plain grid. */}
          <div className="snap-row edge-bleed gap-4 pb-2 sm:hidden">
            {featured.map((w) => (
              <div key={w._id} className="snap-item w-[78vw] max-w-[20rem]">
                <WorkspaceCard workspace={w} compact />
              </div>
            ))}
          </div>

          <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((w, i) => (
              <Reveal key={w._id} index={i}>
                <WorkspaceCard workspace={w} />
              </Reveal>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Button to="/workspaces" fullWidth size="lg">
              View all workspaces
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why us"
            title="Why choose DeskPlace"
            subtitle="Everything you need to find the right workspace, and nothing you don't."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                index={i}
                className="rounded-2xl bg-sunken p-6 transition-colors duration-200 ease-out md:hover:bg-brand-soft"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold tracking-tight text-fg">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Find your space in 3 steps"
            subtitle="Simple, transparent, and built for people who are busy."
          />
          {/* The three steps stack as you scroll rather than sitting side by
              side, so you read them in order instead of scanning a row. */}
          <StickyStack
            items={steps.map((s) => ({
              id: s.step,
              eyebrow: `Step ${s.step}`,
              title: s.title,
              desc: s.desc,
              icon: s.icon,
            }))}
          />
        </div>
      </section>

      {/* Workspace types */}
      <section className="section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Workspace types"
            title="Spaces for every need"
            subtitle="From a single desk to a whole floor."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {types.map((item, i) => (
              <Reveal key={item.title} index={i}>
                <Link
                  to={`/workspaces?type=${encodeURIComponent(item.title)}`}
                  className="press hover-lift relative block h-full rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line md:hover:shadow-card-hover"
                >
                  <span className="absolute right-4 top-4 rounded-md bg-elevated px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {item.badge}
                  </span>
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-fg">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">{item.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="Everything comes standard"
            subtitle="Every DeskPlace listing is verified against this checklist before it goes live."
          />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {amenitiesList.map((item, i) => (
              <Reveal
                key={item}
                as="li"
                index={Math.min(i, 5)}
                className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5 ring-1 ring-line"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-600/15 text-success-600 dark:text-success-400">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-fg">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Localities */}
      <section className="section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our reach"
            title="Workspaces across Hyderabad"
            subtitle="From HITEC City and the Financial District to Banjara Hills and Secunderabad."
          />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {localities.map((area, i) => (
              <Reveal key={area} index={Math.min(i, 5)}>
                <Link
                  to={`/workspaces?area=${encodeURIComponent(area)}`}
                  className="press flex h-full items-center gap-3 rounded-xl bg-surface p-3.5 ring-1 ring-line transition-colors duration-200 ease-out md:hover:ring-brand"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-bold text-brand-soft-fg">
                    {area
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span className="min-w-0 truncate text-sm font-semibold text-fg">
                    {area}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="What people say"
            subtitle="From teams who found their space through us."
          />
          <Reveal>
            <TestimonialsCarousel items={staticTestimonials} />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y px-safe">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            subtitle="Everything you need to know before you book."
          />
          <div className="space-y-2.5">
            {faqs.map((f, i) => {
              const open = openFaq === f.id;
              return (
                <Reveal
                  key={f.id}
                  index={Math.min(i, 3)}
                  className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line-strong"
                >
                  <h3>
                    <button
                      onClick={() => setOpenFaq(open ? null : f.id)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-160 ease-out md:hover:bg-sunken"
                    >
                      <span className="font-semibold text-fg">{f.q}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-subtle transition-transform duration-250 ease-out",
                          open && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  {/* grid-rows 0fr→1fr animates to the content's real height with
                      a plain CSS transition, so rapid toggling retargets
                      smoothly instead of restarting a keyframe. */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-250 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 leading-relaxed text-muted">{f.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y px-safe">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="rounded-3xl bg-brand px-6 py-10 text-center sm:px-12 sm:py-14 lg:py-16">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Get your workspace in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-primary-100 sm:text-lg">
              Browse premium workspaces, talk to owners, and secure the right space all
              in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button to="/workspaces" variant="white" size="lg">
                Explore workspaces
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                to="/contact"
                size="lg"
                className="bg-primary-500 text-white md:hover:bg-primary-400"
              >
                Talk to us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
