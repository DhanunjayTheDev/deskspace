import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Users,
  IndianRupee,
  Maximize2,
  Building,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Wifi,
  Car,
  Coffee,
  Zap,
  Shield,
  Printer,
  Monitor,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { workspaceApi } from "../services/api";
import ContactModal from "../components/ContactModal";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  cafeteria: Coffee,
  "power backup": Zap,
  security: Shield,
  printer: Printer,
  monitor: Monitor,
};

function getAmenityIcon(amenity: string) {
  const key = amenity.toLowerCase();
  for (const [k, Icon] of Object.entries(amenityIcons)) {
    if (key.includes(k)) return Icon;
  }
  return Zap;
}

export default function WorkspaceDetails() {
  const { id } = useParams<{ id: string }>();
  const [imgIdx, setImgIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: workspace, loading, error } = useFetch(
    () => workspaceApi.getById(id!),
    [id]
  );

  const nextImg = useCallback(() => {
    if (!workspace) return;
    setImgIdx((prev) => (prev + 1) % workspace.images.length);
  }, [workspace]);

  const prevImg = useCallback(() => {
    if (!workspace) return;
    setImgIdx((prev) => (prev - 1 + workspace.images.length) % workspace.images.length);
  }, [workspace]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-32 rounded-lg skeleton mb-6" />
          <div className="h-[400px] rounded-3xl skeleton mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 w-2/3 rounded-lg skeleton" />
              <div className="h-5 w-1/2 rounded-lg skeleton" />
              <div className="h-40 rounded-2xl skeleton" />
            </div>
            <div className="h-64 rounded-2xl skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workspace not found</h2>
        <p className="text-gray-500 mb-6">The workspace you're looking for doesn't exist.</p>
        <Link
          to="/workspaces"
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-purple-500"
        >
          Browse Workspaces
        </Link>
      </div>
    );
  }

  const images = workspace.images.length > 0
    ? workspace.images
    : ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop"];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          to="/workspaces"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspaces
        </Link>

        {/* Image Carousel */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-100 h-[300px] sm:h-[400px] md:h-[480px] mb-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIdx}
              src={images[imgIdx]}
              alt={`${workspace.title} - Image ${imgIdx + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === imgIdx ? "bg-white w-6" : "bg-white/50"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {workspace.isFeatured && (
            <span className="absolute top-4 left-4 px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {workspace.title}
            </h1>

            <div className="flex items-center gap-1.5 text-gray-500 mb-6">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>{workspace.address}, {workspace.area}, {workspace.city}</span>
            </div>

            {/* Workspace Type */}
            {workspace.type && workspace.type.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Workspace Types</h2>
                <div className="flex flex-wrap gap-2">
                  {workspace.type.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: "Seats", value: workspace.seats },
                { icon: IndianRupee, label: "Price/Seat", value: `₹${workspace.pricePerSeat.toLocaleString("en-IN")}` },
                { icon: Maximize2, label: "Area", value: `${workspace.squareFeet} sqft` },
                { icon: Building, label: "Floor", value: workspace.floor || "N/A" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-gray-50">
                  <s.icon className="w-5 h-5 text-primary-500 mb-2" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {workspace.amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {workspace.amenities.map((a) => {
                    const Icon = getAmenityIcon(a);
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-sm text-gray-700"
                      >
                        <Icon className="w-4 h-4 text-primary-500" />
                        {a}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sticky CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:sticky md:top-24 md:self-start"
          >
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-card">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Starting at</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-6 h-6 text-primary-600" />
                  <span className="text-3xl font-bold text-gray-900">
                    {workspace.pricePerSeat.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-sm text-gray-400">per seat / month</p>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact on WhatsApp
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Free consultation • No commitment
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        workspace={workspace}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        whatsappNumber={WHATSAPP_NUMBER}
      />
    </div>
  );
}
