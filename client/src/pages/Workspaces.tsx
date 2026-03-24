import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import WorkspaceCard from "../components/WorkspaceCard";
import SkeletonCard from "../components/SkeletonCard";
import Filters, { type FilterValues } from "../components/Filters";
import { useFetch } from "../hooks/useFetch";
import { workspaceApi, type WorkspaceFilters } from "../services/api";

export default function Workspaces() {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area") || "";

  const [filters, setFilters] = useState<FilterValues>({
    city: "",
    area: initialArea,
    type: "",
    minSeats: "",
    maxBudget: "",
  });

  const apiFilters: WorkspaceFilters = useMemo(() => {
    const f: WorkspaceFilters = {};
    if (filters.city) f.city = filters.city;
    if (filters.area) f.area = filters.area;
    if (filters.type) f.type = filters.type;
    if (filters.minSeats) f.minSeats = Number(filters.minSeats);
    if (filters.maxBudget) f.maxBudget = Number(filters.maxBudget);
    return f;
  }, [filters]);

  const { data: workspaces, loading } = useFetch(
    () => workspaceApi.getAll(apiFilters),
    [apiFilters.city, apiFilters.area, apiFilters.type, apiFilters.minSeats, apiFilters.maxBudget]
  );

  const handleFilterChange = useCallback((f: FilterValues) => {
    setFilters(f);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Explore Workspaces</h1>
          <p className="text-gray-500 mt-2">Find the perfect space for your team</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 p-4 bg-white rounded-2xl shadow-card"
        >
          <Filters filters={filters} onChange={handleFilterChange} />
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : workspaces?.map((w, i) => (
                <motion.div
                  key={w._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <WorkspaceCard workspace={w} />
                </motion.div>
              ))}
        </div>

        {!loading && workspaces && workspaces.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center">
              <span className="text-3xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
