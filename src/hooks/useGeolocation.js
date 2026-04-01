import { useState, useCallback } from "react";

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        console.log("✅ Location captured:", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
        let errorMessage = "Failed to get location";
        
        if (err.code === 1) {
          errorMessage = "Permission denied. Please enable location access in your browser settings.";
        } else if (err.code === 2) {
          errorMessage = "Position unavailable. Please try again.";
        } else if (err.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { location, loading, error, getLocation };
};
