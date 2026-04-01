import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { useGeolocation } from "../hooks";
import { mapsService } from "../services/mapsService";
import { toast } from "./Toast";

export const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null);
  const { location, getLocation } = useGeolocation();
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Load Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      toast.warning("Google Maps API key not configured");
      return;
    }

    mapsService
      .loadScript(apiKey)
      .then(() => {
        if (mapRef.current) {
          initializeMap();
        }
      })
      .catch((error) => {
        console.error("Failed to load Google Maps:", error);
        toast.error("Failed to load maps");
      });
  }, []);

  const initializeMap = () => {
    const startLocation = initialLocation || {
      latitude: 40.7128,
      longitude: -74.006,
    };

    mapInstanceRef.current = mapsService.initMap(mapRef.current, {
      zoom: 13,
      center: {
        lat: startLocation.latitude,
        lng: startLocation.longitude,
      },
    });

    // Add click listener to map
    mapInstanceRef.current.addListener("click", (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      updateMarker(lat, lng);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
      });
    });

    // Add initial marker
    if (initialLocation || location) {
      const loc = initialLocation || location;
      updateMarker(loc.latitude, loc.longitude);
    }
  };

  const updateMarker = (lat, lng) => {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else if (mapInstanceRef.current) {
      markerRef.current = mapsService.addMarker(mapInstanceRef.current, {
        lat,
        lng,
      });
    }

    // Center map on marker
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng });
    }
  };

  const handleGetCurrentLocation = () => {
    getLocation();
  };

  useEffect(() => {
    if (location && mapInstanceRef.current) {
      updateMarker(location.latitude, location.longitude);
      onLocationSelect(location);
    }
  }, [location]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
        >
          <MapPin size={16} />
          Use Current Location
        </button>
      </div>

      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
        style={{ minHeight: "300px" }}
      />

      <p className="text-xs text-gray-600">
        Click on the map to select a location or use "Use Current Location"
      </p>
    </div>
  );
};
