import { FiLoader } from "react-icons/fi";

export default function MapLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-3">
      <FiLoader className="w-8 h-8 text-primary animate-spin" />
      <p className="text-gray-500 text-sm font-medium">Fetching properties...</p>
    </div>
  );
}
