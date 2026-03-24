import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Clock, Headphones, Star, ChevronDown, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "boring-avatars";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WorkspaceCard from "../components/WorkspaceCard";
import SkeletonCard from "../components/SkeletonCard";
// @ts-ignore
import LogoLoop from "../components/LogoLoop";
// @ts-ignore
import CircularText from "../components/CircularText";
// @ts-ignore
import RotatingText from "../components/RotatingText";
import { useFetch } from "../hooks/useFetch";
import { workspaceApi, siteApi } from "../services/api";

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
          
          {/* Floating geometric shapes */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-20 w-24 h-24 bg-primary-300/20 rounded-3xl blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 left-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left z-10">
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
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight flex flex-wrap items-center gap-3"
              >
                <span>Find Your Perfect</span>
                <RotatingText
                  texts={[
                    "Private Office",
                    "Meeting Rooms",
                    "Dedicated Desks",
                    "Virtual Office",
                    "Training Room",
                  ]}
                  mainClassName="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent inline-block"
                  elementLevelClassName="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent"
                  rotationInterval={3000}
                  splitBy="characters"
                  staggerDuration={0.02}
                />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg text-gray-600 max-w-2xl"
              >
                Discover premium coworking spaces, private offices, and meeting rooms.
                Your ideal workspace is just a search away.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex justify-center lg:justify-start"
              >
                <SearchBar />
              </motion.div>
            </div>

            {/* Right visual element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Floating card 1 */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateZ: [0, 5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-72 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 z-20"
                style={{ top: "0", left: "0" }}
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Private Office</p>
                    <p className="text-xs text-gray-500">Dedicated space</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Perfect for teams needing focused work</p>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotateZ: [0, -5, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute w-72 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 z-10"
                style={{ bottom: "20px", right: "0" }}
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Verified Listings</p>
                    <p className="text-xs text-gray-500">100% authentic</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">All spaces verified for quality</p>
              </motion.div>

              {/* Center circular design */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
                className="absolute w-96 h-96 rounded-full border-2 border-primary-200/30 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, linear: true }}
                  className="w-72 h-72 rounded-full border-2 border-purple-200/30 flex items-center justify-center"
                >
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-primary-600 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-gray-700">Workspace Hub</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom circle decoration */}
          <div className="absolute right-6 bottom-6 hidden md:block">
            <CircularText text=" ★ DESKSPACE ★ DESKSPACE" spinDuration={15} onHover="speedUp" />
          </div>
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
                      : <Avatar size={40} name={t.name || "User"} variant="beam" colors={["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"]} />
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
                Browse premium workspaces, connect with owners, and secure your perfect space all in one place.
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

      {/* Floating Phone Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <motion.a
          href="tel:+919999999999"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow"
          title="Call us"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
