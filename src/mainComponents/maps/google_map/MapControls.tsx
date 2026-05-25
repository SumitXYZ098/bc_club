import { FiMap, FiMinus, FiNavigation, FiPlus } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";

export default function MapControls({
  map,
  isSatellite,
  measureMode,
  toggleMapStyle,
  handleGeolocation,
  handleSchool,
  handleMeasure,
}: {
  map: google.maps.Map | null;
  isSatellite: boolean;
  measureMode: boolean;
  toggleMapStyle: () => void;
  handleGeolocation: () => void;
  handleSchool: () => void;
  handleMeasure: () => void;
}) {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
      <div className="flex flex-col bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        <button
          className="p-2.5 border-b hover:bg-gray-50"
          onClick={() => map?.setZoom((map.getZoom() || 5) + 1)}
        >
          <FiPlus className="w-5 h-5 text-gray-600" />
        </button>

        <button
          className="p-2.5 hover:bg-gray-50"
          onClick={() => map?.setZoom((map.getZoom() || 5) - 1)}
        >
          <FiMinus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <button
        onClick={toggleMapStyle}
        className={`p-2.5 rounded-md shadow-lg border transition-colors ${
          isSatellite
            ? "bg-primary text-white border-primary"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
        title="Map Style"
      >
        <FiMap className="w-5 h-5" />
      </button>

      <button
        onClick={handleMeasure}
        className={`p-2.5 rounded-md shadow-lg border transition-colors ${
          measureMode
            ? "bg-primary text-white border-primary"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100"
        }`}
        title="Measure Distance"
      >
        <TbRulerMeasure className="w-5 h-5" />
      </button>

      <button
        onClick={handleGeolocation}
        className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        title="Current Location"
      >
        <FiNavigation className="w-5 h-5 text-gray-600" />
      </button>

      <button
        onClick={handleSchool}
        className="p-2.5 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        title="Nearest School"
      >
        <MdSchool className="w-5 h-5 text-gray-600 hover:text-primary" />
      </button>
    </div>
  );
}
