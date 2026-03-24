import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, IndianRupee } from "lucide-react";
import type { Workspace } from "../types/workspace";

interface Props {
  workspace: Workspace;
}

function WorkspaceCard({ workspace }: Props) {
  const thumbnail = workspace.images[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop";

  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={thumbnail}
            alt={workspace.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {workspace.isFeatured && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full shadow-lg">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {workspace.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-primary-400" />
            <span className="line-clamp-1">{workspace.area}, {workspace.city}</span>
          </div>

          {/* Type Badges */}
          {workspace.type && workspace.type.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {workspace.type.slice(0, 2).map((t) => (
                <span key={t} className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                  {t}
                </span>
              ))}
              {workspace.type.length > 2 && (
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  +{workspace.type.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Users className="w-4 h-4 text-primary-400" />
              <span>{workspace.seats} seats</span>
            </div>
            <div className="flex items-center gap-0.5 text-lg font-bold text-primary-600">
              <IndianRupee className="w-4 h-4" />
              {workspace.pricePerSeat.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-gray-400">/seat</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default memo(WorkspaceCard);
