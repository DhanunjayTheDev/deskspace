import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface Props {
  whatsappNumber: string;
}

export default function FloatingContactButton({ whatsappNumber }: Props) {
  const handleClick = () => {
    const message = `Hi, I'm interested in learning more about DeskSpace workspaces.`;
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl shadow-green-500/40 flex items-center justify-center hover:shadow-green-500/60 transition-all duration-300"
      aria-label="Contact on WhatsApp"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.div>

      {/* Pulse rings */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full border-2 border-green-400"
      />
    </motion.button>
  );
}
