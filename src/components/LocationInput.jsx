import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Loader, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  });
}

export const LocationInput = React.forwardRef(({ label, error, value = "", onChange, onLocationSelect, ...props }, ref) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inputValue, setInputValue] = useState(value);

  // Sync inputValue with value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle search queries
  useEffect(() => {
    if (inputValue && typeof inputValue === "string" && inputValue.length > 2) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [inputValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Call the onChange from react-hook-form
    onChange?.(e);
  };

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8`
      );
      const data = await response.json();
      
      const formattedSuggestions = data.map((item) => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
      
      setSuggestions(formattedSuggestions);
      if (formattedSuggestions.length > 0) {
        setIsOpen(true);
        setMapCenter([formattedSuggestions[0].lat, formattedSuggestions[0].lon]);
      }
      setSelectedIndex(null);
      
      console.log("📍 LocationInput suggestions:", formattedSuggestions.length, "results");
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion, index) => {
    // Create synthetic event for react-hook-form compatibility
    const syntheticEvent = {
      target: { value: suggestion.label, name: ref?.name || "location" }
    };
    
    setInputValue(suggestion.label);
    onChange?.(syntheticEvent);
    onLocationSelect?.({
      location: suggestion.label,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    });
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(null);
  };

  return (
    <div className="flex flex-col gap-1 relative">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400">
          <MapPin size={16} />
        </div>
        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-white text-gray-900 placeholder-gray-400 ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-emerald-500"
          }`}
          {...props}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <Loader size={16} className="animate-spin text-emerald-600" />
          </div>
        )}
      </div>

      {/* Suggestions with Map */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-20 overflow-hidden w-full">
          {/* Map Display */}
          <div className="h-48 w-full border-b border-gray-200 bg-gray-100">
            <MapContainer 
              key={`map-${mapCenter[0]}-${mapCenter[1]}`}
              center={mapCenter} 
              zoom={9} 
              style={{ height: "100%", width: "100%" }} 
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {suggestions.map((suggestion, index) => (
                <Marker
                  key={`marker-${index}`}
                  position={[suggestion.lat, suggestion.lon]}
                  eventHandlers={{
                    click: () => {
                      handleSelectSuggestion(suggestion, index);
                    },
                  }}
                >
                  <Popup>{suggestion.label}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* List */}
          <div className="max-h-32 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`suggestion-${index}`}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion, index)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-3 transition border-b border-gray-100 last:border-b-0 flex items-start gap-2 ${
                  selectedIndex === index ? "bg-emerald-50" : "hover:bg-gray-50"
                }`}
              >
                <MapPin size={14} className="text-emerald-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2 font-medium">{suggestion.label.split(",")[0]}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{suggestion.label.split(",").slice(1).join(",")}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});

LocationInput.displayName = "LocationInput";
