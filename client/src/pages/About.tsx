import {
  Building2,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  Shield,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { staticAwards, staticTeam } from "../services/api";
import Reveal from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import CountUp from "../components/ui/CountUp";

const stats = [
  { icon: Building2, value: "250+", label: "Workspaces" },
  { icon: MapPin, value: "16", label: "Localities" },
  { icon: Users, value: "12K+", label: "Happy users" },
  { icon: TrendingUp, value: "95%", label: "Satisfaction" },
];

const values = [
  {
    icon: Target,
    title: "User first",
    desc: "Every feature starts with what's best for the people using the platform.",
  },
  {
    icon: Heart,
    title: "Trust & transparency",
    desc: "Verified listings, honest pricing, real reviews. No hidden fees.",
  },
  {
    icon: Lightbulb,
    title: "Continuous innovation",
    desc: "Better matching, smarter search. Standing still isn't an option.",
  },
  {
    icon: Globe,
    title: "City-wide reach, local heart",
    desc: "Coverage across Hyderabad that still understands every neighbourhood.",
  },
];

const differences = [
  {
    icon: Shield,
    title: "100% verified",
    desc: "Every space vetted by our team. No fake listings, no surprises.",
    badge: "Trust",
  },
  {
    icon: Zap,
    title: "Instant access",
    desc: "Book tours, negotiate terms and get keys in hours, not weeks.",
    badge: "Speed",
  },
  {
    icon: Heart,
    title: "Dedicated support",
    desc: "Real people helping from first search through to move-in day.",
    badge: "Care",
  },
  {
    icon: TrendingUp,
    title: "Flexible terms",
    desc: "Month-to-month, yearly or custom. Scale up or down as you grow.",
    badge: "Freedom",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Series A funding",
    desc: "Raised $15M to deepen coverage across Hyderabad and launch smarter matching.",
    icon: TrendingUp,
  },
  {
    year: "2023",
    title: "250+ workspaces",
    desc: "Crossed 250 verified listings across 16 Hyderabad business localities.",
    icon: Building2,
  },
  {
    year: "2022",
    title: "Mobile app launch",
    desc: "Released iOS and Android apps with instant booking and virtual tours.",
    icon: Zap,
  },
  {
    year: "2021",
    title: "Platform v2",
    desc: "Rebuilt from the ground up with verified listings and recommendations.",
    icon: Lightbulb,
  },
  {
    year: "2020",
    title: "Founded",
    desc: "Started with a mission to make finding workspace as easy as booking a hotel.",
    icon: Star,
  },
];

export default function About() {
  // Bundled data, read straight from the module. Routing it through a promise
  // only bought an extra render and a frame of empty layout.
  const team = staticTeam;
  const awards = staticAwards;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink-950 px-safe">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* Flat scrim, one opacity. */}
        <div className="absolute inset-0 -z-10 bg-ink-950/75" />

        <div className="mx-auto max-w-content px-4 pt-header pb-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <div className="max-w-3xl pt-8 sm:pt-14 lg:pt-16">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              About DeskPlace
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Where work meets <span className="text-primary-300">inspiration</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              We connect professionals with Hyderabad workspaces worth showing up to.
              Private offices, collaborative desks, meeting rooms from HITEC City to
              Secunderabad, all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-7 px-4 px-safe sm:-mt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="grid grid-cols-2 divide-line rounded-2xl bg-surface shadow-card ring-1 ring-line sm:divide-x lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-4 py-5 text-center sm:py-7"
              >
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-fg">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CountUp
                  value={s.value}
                  className="text-2xl font-extrabold tracking-tight text-fg sm:text-3xl"
                />
                <span className="mt-1 text-sm text-muted">{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="section-y px-safe">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal className="space-y-8">
            <div>
              <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-soft-fg">
                Mission
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-fg sm:text-3xl lg:text-4xl">
                Make premium workspace accessible
              </h2>
              <p className="mt-3 leading-relaxed text-muted sm:text-lg">
                A transparent, easy-to-use platform where businesses of any size can find
                and book the right office environment without a broker and without a
                three-week wait.
              </p>
            </div>
            <div>
              <span className="inline-block rounded-full bg-elevated px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fg">
                Vision
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-fg sm:text-3xl lg:text-4xl">
                A desk that fits, wherever you are
              </h2>
              <p className="mt-3 leading-relaxed text-muted sm:text-lg">
                Every professional with access to a workspace that supports focus,
                collaboration and growth regardless of the city they're in.
              </p>
            </div>
          </Reveal>

          <Reveal index={1}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
              alt="A team collaborating in a shared workspace"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card lg:aspect-[4/5]"
            />
          </Reveal>
        </div>
      </section>

      {/* Team */}
      {Array.isArray(team) && team.length > 0 && (
        <section className="bg-sunken section-y px-safe">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Team"
              title="Meet the team"
              subtitle="The people building the future of workspace discovery."
            />
            {/* Portrait-first cards: the name and role sit on the photo, and
                the bio slides up over it on hover. On touch there is no hover,
                so the bio is simply always visible there. */}
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {team.map((m, i) => (
                <Reveal key={m._id} as="li" index={i}>
                  <article className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-900">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-brand text-7xl font-extrabold text-white">
                        {m.name[0]}
                      </div>
                    )}

                    {/* Flat scrim panel behind the text, not a gradient wash. */}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="rounded-2xl bg-ink-950/75 p-4 backdrop-blur-md">
                        <p className="text-lg font-bold tracking-tight text-white">
                          {m.name}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-primary-300">
                          {m.role}
                        </p>
                        {m.bio && (
                          <div
                            className={
                              "grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-300 ease-out " +
                              "md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100"
                            }
                          >
                            <p className="overflow-hidden text-sm leading-relaxed text-white/75">
                              <span className="mt-2 block">{m.bio}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold tabular-nums text-white backdrop-blur-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Awards */}
      {Array.isArray(awards) && awards.length > 0 && (
        <section className="section-y px-safe">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Awards"
              title="Awards & achievements"
              subtitle="Milestones that define our journey."
            />
            {/* The card surface follows the theme and only the trophy chip stays
                amber. A fixed cream panel left the themed title text sitting
                white-on-cream in dark mode. */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {awards.map((a, i) => (
                <Reveal
                  key={a._id}
                  index={i}
                  className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-white">
                      <Trophy className="h-6 w-6" aria-hidden="true" />
                    </span>
                    {a.year && (
                      <span className="rounded-full bg-accent-500/15 px-2.5 py-1 text-xs font-bold text-accent-700 dark:text-accent-300">
                        {a.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-fg">
                    {a.title}
                  </h3>
                  {a.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {a.description}
                    </p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our DNA"
            title="Values that guide us"
            subtitle="Every decision is rooted in these four principles."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {values.map((item, i) => (
              <Reveal
                key={item.title}
                index={i}
                className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-fg">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold tracking-tight text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-y px-safe">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Journey"
            title="Our story so far"
            subtitle="Key milestones that shaped who we are."
          />
          <ol className="relative">
            {/* Solid rail, not a fading gradient. */}
            <div
              className="absolute bottom-4 left-[15px] top-2 w-0.5 bg-line-strong"
              aria-hidden="true"
            />
            {milestones.map((item, i) => (
              <Reveal
                key={item.year}
                as="li"
                index={Math.min(i, 3)}
                className="relative pb-8 pl-12 last:pb-0"
              >
                <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-brand text-white">
                  <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-soft-fg">
                      {item.year}
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-fg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-sunken section-y px-safe">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Difference"
            title="Why choose DeskPlace"
            subtitle="Not another listing site a partner in finding the right room."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {differences.map((item, i) => (
              <Reveal
                key={item.title}
                index={i}
                className="relative rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line"
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
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand section-y px-safe">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to find your space?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-100 sm:text-lg">
            Join thousands of professionals who found their workspace through DeskPlace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button to="/workspaces" variant="white" size="lg">
              Explore workspaces
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
      </section>
    </>
  );
}
