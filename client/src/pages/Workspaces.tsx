import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import WorkspaceCard from "../components/WorkspaceCard";
import SkeletonCard from "../components/SkeletonCard";
import Filters, { EMPTY_FILTERS, type FilterValues } from "../components/Filters";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import { workspaceApi, type WorkspaceFilters } from "../services/api";

export default function Workspaces() {
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the source of truth, so a shared link or a back navigation
  // restores exactly the result set the person was looking at.
  const [filters, setFilters] = useState<FilterValues>(() => ({
    q: searchParams.get("q") || "",
    area: searchParams.get("area") || "",
    type: searchParams.get("type") || "",
    minSeats: searchParams.get("seats") || "",
    maxBudget: searchParams.get("budget") || "",
  }));

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.q) next.set("q", filters.q);
    if (filters.area) next.set("area", filters.area);
    if (filters.type) next.set("type", filters.type);
    if (filters.minSeats) next.set("seats", filters.minSeats);
    if (filters.maxBudget) next.set("budget", filters.maxBudget);
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams]);

  const apiFilters: WorkspaceFilters = useMemo(() => {
    const f: WorkspaceFilters = {};
    if (filters.q) f.q = filters.q;
    if (filters.area) f.area = filters.area;
    if (filters.type) f.type = filters.type;
    if (filters.minSeats) f.minSeats = Number(filters.minSeats);
    if (filters.maxBudget) f.maxBudget = Number(filters.maxBudget);
    return f;
  }, [filters]);

  const { data: results, loading } = useFetch(
    () => workspaceApi.getAll(apiFilters),
    [
      apiFilters.q,
      apiFilters.area,
      apiFilters.type,
      apiFilters.minSeats,
      apiFilters.maxBudget,
    ]
  );

  const handleChange = useCallback((f: FilterValues) => setFilters(f), []);
  const count = results?.length ?? 0;
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="pt-header px-safe">
      <div className="mx-auto max-w-content px-4 pb-16 sm:px-6 lg:px-8">
        <header className="py-6 sm:py-9">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl lg:text-5xl">
            Workspaces in Hyderabad
          </h1>
          <p className="mt-2 text-base text-muted sm:text-lg">
            Private offices, desks and meeting rooms across the city all verified.
          </p>
        </header>

        {/* Sticky on phones so the filter control is always one tap away while
            scrolling a long result list. */}
        <div className="sticky top-header z-30 -mx-4 mb-6 border-b border-line bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:mb-8 md:rounded-2xl md:border md:border-line md:bg-surface md:p-5 md:backdrop-blur-none">
          <Filters filters={filters} onChange={handleChange} />
        </div>

        <div
          className="mb-5 flex items-center justify-between gap-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm text-muted">
            {loading
              ? "Finding spaces…"
              : `${count} ${count === 1 ? "space" : "spaces"} available`}
          </p>
          {hasFilters && !loading && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="press text-sm font-semibold text-brand-soft-fg md:hidden"
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : count > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results!.map((w, i) => (
              <Reveal key={w._id} index={Math.min(i, 3)}>
                <WorkspaceCard workspace={w} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-14 text-center sm:py-20">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated text-subtle">
              <SearchX className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-fg">
              No workspaces found
            </h2>
            <p className="mt-2 max-w-sm text-muted">
              Nothing matches these filters yet. Try widening the budget or clearing the
              area.
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setFilters(EMPTY_FILTERS)}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
