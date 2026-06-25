import { FiX } from "react-icons/fi";

interface ActiveFilterPill {
  label: string;
  onRemove: () => void;
}

interface MapActiveFiltersProps {
  hasActiveFilters: boolean;
  activeFilterPills: ActiveFilterPill[];
  resetAllFilters: () => void;
}

export default function MapActiveFilters({
  hasActiveFilters,
  activeFilterPills,
  resetAllFilters,
}: MapActiveFiltersProps) {
  if (!hasActiveFilters) return null;

  return (
    <div className="relative flex items-center gap-2 flex-wrap w-full">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 mr-1">
        Active:
      </span>

      {activeFilterPills.map((pill, idx) => (
        <div
          key={idx}
          className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full animate-in fade-in duration-200"
        >
          <span>{pill.label}</span>
          <button
            onClick={pill.onRemove}
            className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
            aria-label="Remove filter"
          >
            <FiX size={11} />
          </button>
        </div>
      ))}

      <button
        onClick={resetAllFilters}
        className="ml-auto flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-[10px] transition-all duration-200 shrink-0 cursor-pointer"
      >
        <FiX size={12} />
        Reset All
      </button>
    </div>
  );
}
