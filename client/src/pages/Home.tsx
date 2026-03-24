import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Clock, Headphones, Star, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WorkspaceCard from "../components/WorkspaceCard";
import SkeletonCard from "../components/SkeletonCard";
import FloatingContactButton from "../components/FloatingContactButton";
// @ts-ignore
import LogoLoop from "../components/LogoLoop";
// @ts-ignore
import CircularText from "../components/CircularText";
import { useFetch } from "../hooks/useFetch";
import { workspaceApi, siteApi } from "../services/api";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";

interface Partner { _id: string; name: string; logo: string; website: string; }
interface Testimonial { _id: string; name: string; role: string; company: string; photo: string; quote: string; rating: number; }
interface FAQ { _id: string; question: string; answer: string; }

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Sparkles,
    title: "Premium Spaces",
    desc: "Handpicked workspaces with modern amenities and stunning interiors",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    desc: "Every workspace is personally verified for quality and authenticity",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    desc: "Get connected with workspace owners in minutes, not days",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our team helps you find the perfect space for your needs",
  },
];

export default function Home() {
  const { data: featured, loading } = useFetch(() => workspaceApi.getFeatured(), []);
  const { data: partners } = useFetch<Partner[]>(() => siteApi.getPartners(), []);
  const { data: testimonials } = useFetch<Testimonial[]>(() => siteApi.getTestimonials(), []);
  const { data: faqs } = useFetch<FAQ[]>(() => siteApi.getFAQs(), []);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-32 w-96 h-96 bg-primary-200 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 right-0 w-80 h-80 bg-purple-200 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Premium Workspace Solutions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent">
              Workspace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Discover premium coworking spaces, private offices, and meeting rooms.
            Your ideal workspace is just a search away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 relative flex justify-center"
          >
            <SearchBar />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <CircularText text=" ★ DESKSPACE ★ DESKSPACE" spinDuration={15} onHover="speedUp" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Partners */}
      {partners && partners.length > 0 && (
        <section className="py-12 px-4 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8"
            >
              Trusted Partners
            </motion.p>
            <div className="relative group">
              {/* Left depth effect */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
              
              {/* Right depth effect */}
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
              
              <LogoLoop
                logos={partners.map((p) => ({
                  _id: p._id,
                  src: p.logo,
                  alt: p.name,
                  title: p.name,
                }))}
                speed={120}
                direction="left"
                pauseOnHover={true}
                logoHeight={32}
                gap={48}
                renderItem={(item: any) => (
                  <img
                    src={item.src}
                    alt={item.alt}
                    title={item.title}
                    className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
                  />
                )}
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Workspaces */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-between mb-10"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-3xl font-bold text-gray-900">Featured Workspaces</h2>
              <p className="text-gray-500 mt-2">Handpicked spaces for your team</p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Link
                to="/workspaces"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : featured?.slice(0, 6).map((w, i) => (
                  <motion.div
                    key={w._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <WorkspaceCard workspace={w} />
                  </motion.div>
                ))}
          </div>

          {!loading && (!featured || featured.length === 0) && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No featured workspaces yet. Check back soon!</p>
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/workspaces"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-purple-500"
            >
              View All Workspaces <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-primary-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-bold text-gray-900">What People Say</h2>
              <p className="text-gray-500 mt-2">Hear from professionals who found their perfect workspace</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                    {t.photo
                      ? <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                    }
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900">Why Choose DeskSpace</h2>
            <p className="text-gray-500 mt-2">Everything you need to find the perfect workspace</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-primary-50 hover:to-purple-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-500 mt-2">Everything you need to know about workspace booking</p>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === f._id ? null : f._id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{f.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === f._id ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === f._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{f.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
            </div>
            <div className="relative z-10 px-8 py-16 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get Your Workspace in Minutes
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                Browse premium workspaces, connect with owners, and secure your perfect space — all in one place.
              </p>
              <Link
                to="/workspaces"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-primary-700 bg-white hover:bg-primary-50 shadow-lg transition-all"
              >
                Explore Workspaces <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Contact Button */}
      <FloatingContactButton whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  );
}
