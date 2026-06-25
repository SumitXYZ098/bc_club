import { FiLoader } from "react-icons/fi";

export default function MapLoadingBadge() {
  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center justify-center">
      <div className="bg-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-gray-100 animate-in fade-in zoom-in duration-300">
        <FiLoader className="animate-spin text-primary w-4 h-4" />
        <span className="text-xs font-bold text-gray-700 tracking-tight">Loading...</span>
      </div>
    </div>
  );
}
