import { memo, useState } from "react";
import {
  Building2,
  IndianRupee,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import CustomSelect from "./CustomSelect";
import Sheet from "./ui/Sheet";
import Button from "./ui/Button";
import { localities, workspaceTypes } from "../data/workspaces";
import { cn } from "../lib/utils";

export interface FilterValues {
  q: string;
  area: string;
  type: string;
  minSeats: string;
  maxBudget: string;
}

export const EMPTY_FILTERS: FilterValues = {
  q: "",
  area: "",
  type: "",
  minSeats: "",
  maxBudget: "",
};

interface Props {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
}

const fieldClass =
  "h-12 w-full rounded-xl border border-line-strong bg-surface pl-10 pr-3 text-sm text-fg " +
  "placeholder:text-subtle transition-colors duration-160 ease-out " +
  "md:hover:border-line-strong focus-visible:border-brand";

function Field({
  icon: Icon,
  ...input
}: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
        aria-hidden="true"
      />
      <input className={fieldClass} {...input} />
    </div>
  );
}

function Filters({ filters, onChange }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  // The sheet edits a copy so a half-typed filter doesn't refetch on every
  // keystroke behind the scrim; the result list updates when you apply.
  const [draft, setDraft] = useState<FilterValues>(filters);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const openSheet = () => {
    setDraft(filters);
    setSheetOpen(true);
  };

  const fields = (values: FilterValues, set: (v: FilterValues) => void) => (
    <>
      <Field
        icon={Search}
        type="search"
        value={values.q}
        onChange={(e) => set({ ...values, q: e.target.value })}
        placeholder="Name or landmark"
        aria-label="Search by name or landmark"
      />
      <CustomSelect
        value={values.area}
        onChange={(val) => set({ ...values, area: val })}
        options={localities}
        placeholder="Any locality"
        label="Locality"
        icon={<MapPin className="h-4 w-4" />}
      />
      <CustomSelect
        value={values.type}
        onChange={(val) => set({ ...values, type: val })}
        options={workspaceTypes}
        placeholder="All types"
        label="Workspace type"
        icon={<Building2 className="h-4 w-4" />}
      />
      <Field
        icon={Users}
        type="number"
        inputMode="numeric"
        min={1}
        value={values.minSeats}
        onChange={(e) => set({ ...values, minSeats: e.target.value })}
        placeholder="Min seats"
        aria-label="Minimum seats"
      />
      <Field
        icon={IndianRupee}
        type="number"
        inputMode="numeric"
        min={0}
        value={values.maxBudget}
        onChange={(e) => set({ ...values, maxBudget: e.target.value })}
        placeholder="Max budget / seat"
        aria-label="Maximum budget per seat"
      />
    </>
  );

  return (
    <>
      {/* Phone: one control that opens a sheet. Five inputs stacked inline
          would push the results below the fold before you've searched. */}
      <div className="md:hidden">
        <button
          onClick={openSheet}
          className={cn(
            "press flex h-12 w-full items-center justify-center gap-2 rounded-xl",
            "text-sm font-semibold transition-colors duration-160 ease-out",
            activeCount > 0
              ? "bg-brand text-white"
              : "border border-line-strong bg-surface text-fg"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-primary-700">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop: everything visible at once. */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {fields(filters, onChange)}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="press mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted transition-colors duration-160 ease-out md:hover:bg-elevated md:hover:text-fg"
          >
            <X className="h-4 w-4" />
            Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        description="Narrow down the spaces you see."
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setDraft(EMPTY_FILTERS)}
              disabled={Object.values(draft).every((v) => !v)}
            >
              Clear all
            </Button>
            <Button
              fullWidth
              onClick={() => {
                onChange(draft);
                setSheetOpen(false);
              }}
            >
              Show results
            </Button>
          </div>
        }
      >
        <div className="space-y-3 pt-1">{fields(draft, setDraft)}</div>
      </Sheet>
    </>
  );
}

export default memo(Filters);
