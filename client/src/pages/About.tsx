import { motion } from "framer-motion";
import { useFetch } from "../hooks/useFetch";
import { siteApi } from "../services/api";
import { Trophy, MapPin, Users, Building2, TrendingUp } from "lucide-react";

interface TeamMember { _id: string; name: string; role: string; bio: string; photo: string; }
interface Award { _id: string; title: string; year: string; description: string; image: string; }

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: "easeOut" },
  }),
};

const stats = [
  { icon: Building2, value: "500+", label: "Workspaces" },
  { icon: MapPin, value: "50+", label: "Cities" },
  { icon: Users, value: "10K+", label: "Happy Users" },
  { icon: TrendingUp, value: "95%", label: "Satisfaction" },
];

export default function About() {
  const { data: team } = useFetch<TeamMember[]>(() => siteApi.getTeam(), []);
  const { data: awards } = useFetch<Award[]>(() => siteApi.getAwards(), []);

  return (
    <div className="min-h-screen">
      {/* Hero with Background Image */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
            alt="Modern workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/20">
            About DeskSpace
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Where Work Meets{" "}
            <span className="bg-gradient-to-r from-primary-300 to-purple-300 bg-clip-text text-transparent">
              Inspiration
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We connect professionals with inspiring workspaces. Whether you need a
            private office, a collaborative desk, or a meeting room — DeskSpace brings
            the best workspace options in your city, all in one place.
          </p>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center py-8 px-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-3">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{s.value}</span>
                <span className="text-sm text-gray-500 mt-1">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-600 to-purple-600 text-white">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-primary-100 leading-relaxed">
                To democratize access to premium workspaces by creating a transparent, easy-to-use
                platform where businesses of all sizes can find and book the perfect office environment.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-500 leading-relaxed">
                A world where every professional has access to a workspace that inspires productivity,
                fosters collaboration, and supports growth — regardless of where they are.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team collaboration"
              className="rounded-3xl shadow-2xl w-full object-cover h-[480px]"
            />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-200 to-primary-200 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      {team && team.length > 0 && (
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our People</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Meet the Team</h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                The passionate people building the future of workspace discovery
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white/80">{m.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
                    <p className="text-sm text-primary-600 font-semibold mt-0.5">{m.role}</p>
                    {m.bio && (
                      <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-3">{m.bio}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards Section */}
      {awards && awards.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Recognition</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Awards & Achievements</h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">Milestones that define our journey</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {awards.map((a, i) => (
                <motion.div
                  key={a._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {a.image ? (
                      <img src={a.image} alt={a.title} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {a.year && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{a.year}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                  {a.description && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{a.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Find Your Space?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join thousands of professionals who found their perfect workspace through DeskSpace.
          </p>
          <a
            href="/workspaces"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-primary-700 bg-white hover:bg-primary-50 shadow-lg transition-all"
          >
            Explore Workspaces
          </a>
        </motion.div>
      </section>
    </div>
  );
}
