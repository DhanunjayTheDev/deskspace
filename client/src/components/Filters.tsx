import { memo, useState } from "react";
import { MapPin, Users, IndianRupee, SlidersHorizontal, X, Building2 } from "lucide-react";
import CustomSelect from "./CustomSelect";

export interface FilterValues {
  city: string;
  area: string;
  type: string;
  minSeats: string;
  maxBudget: string;
}

const WORKSPACE_TYPES = [
  "Private Office",
  "Meeting Rooms",
  "Dedicated Desks",
  "Virtual Office",
  "Training Room",
];

interface Props {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
}

function Filters({ filters, onChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (key: keyof FilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clear = () => {
    onChange({ city: "", area: "", type: "", minSeats: "", maxBudget: "" });
  };

  const hasFilters = filters.city || filters.area || filters.type || filters.minSeats || filters.maxBudget;

  const filterContent = (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap">
      <div className="relative flex-1 min-w-[140px]">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filters.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="City"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        />
      </div>
      <div className="relative flex-1 min-w-[140px]">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filters.area}
          onChange={(e) => update("area", e.target.value)}
          placeholder="Area / Locality"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        />
      </div>
      <div className="relative flex-1 min-w-[160px]">
        <CustomSelect
          value={filters.type}
          onChange={(val) => update("type", val)}
          options={WORKSPACE_TYPES}
          placeholder="All Types"
          icon={<Building2 className="w-4 h-4" />}
          className="w-full"
        />
      </div>
      <div className="relative flex-1 min-w-[120px]">
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="number"
          value={filters.minSeats}
          onChange={(e) => update("minSeats", e.target.value)}
          placeholder="Min Seats"
          min={1}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        />
      </div>
      <div className="relative flex-1 min-w-[140px]">
        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="number"
          value={filters.maxBudget}
          onChange={(e) => update("maxBudget", e.target.value)}
          placeholder="Max Budget/Seat"
          min={0}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
        />
      </div>
      {hasFilters && (
        <button
          onClick={clear}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sm:hidden flex items-center gap-2 mb-3 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasFilters && (
          <span className="w-2 h-2 rounded-full bg-primary-500" />
        )}
      </button>

      {/* Desktop: always visible */}
      <div className="hidden sm:block">{filterContent}</div>

      {/* Mobile: expandable */}
      {mobileOpen && <div className="sm:hidden">{filterContent}</div>}
    </div>
  );
}

export default memo(Filters);
