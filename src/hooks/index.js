import { useEffect, useState } from "react";

// Custom hook for geolocation
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setError(errorMsg);
      console.error("❌", errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    console.log("📍 Requesting geolocation...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(loc);
        setError(null);
        console.log("✅ Geolocation success:", loc);
        setLoading(false);
      },
      (err) => {
        let errorMessage = "Failed to get location";
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Permission denied. Please allow location access in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = err.message || "Unknown geolocation error";
        }
        
        setError(errorMessage);
        setLocation(null);
        console.error("❌ Geolocation error:", errorMessage, err);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { location, error, loading, getLocation };
};

// Custom hook for debounced value
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};

// Custom hook for previous value
export const usePrevious = (value) => {
  const [previous, setPrevious] = useState();

  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
};
