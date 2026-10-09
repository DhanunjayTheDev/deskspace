import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Search } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { localities, workspaceTypes } from "../data/workspaces";

interface Props {
  /** Rendered over the dark hero, where the surrounding text is white. */
  onDark?: boolean;
}

export default function SearchBar({ onDark }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (area) params.set("area", area);
    if (type) params.set("type", type);
    navigate(`/workspaces${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-2xl bg-surface p-2.5 shadow-card ring-1 ring-line"
      role="search"
    >
      {/* One column on phones, one row from lg up. The submit button is never
          layered over the input that overlap is what made the old bar
          impossible to tap accurately. */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:min-w-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, locality or landmark"
            aria-label="Search by name, locality or landmark"
            className="h-12 w-full rounded-xl bg-sunken pl-10 pr-3 text-sm text-fg placeholder:text-subtle transition-colors duration-160 ease-out focus-visible:bg-surface focus-visible:ring-1 focus-visible:ring-brand"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:contents">
          <CustomSelect
            value={area}
            onChange={setArea}
            options={localities}
            placeholder="Any locality"
            label="Locality"
            icon={<MapPin className="h-4 w-4" />}
            className="lg:w-44"
            triggerClassName="bg-sunken border-transparent md:hover:border-line-strong"
          />
          <CustomSelect
            value={type}
            onChange={setType}
            options={workspaceTypes}
            placeholder="Any type"
            label="Workspace type"
            icon={<Building2 className="h-4 w-4" />}
            className="lg:w-48"
            triggerClassName="bg-sunken border-transparent md:hover:border-line-strong"
          />
        </div>

        <button
          type="submit"
          className="press flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors duration-160 ease-out md:hover:bg-brand-hover"
        >
          <Search className="h-4 w-4 lg:hidden" aria-hidden="true" />
          Search
        </button>
      </div>

      {onDark && <span className="sr-only">Search available workspaces</span>}
    </form>
  );
}
