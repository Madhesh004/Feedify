// Google Maps Service
// This service handles Google Maps integration for Feedify

export const mapsService = {
  // Initialize map
  initMap: (containerElement, options = {}) => {
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return null;
    }

    const defaultOptions = {
      zoom: 13,
      center: { lat: 40.7128, lng: -74.006 }, // Default to NYC
      ...options,
    };

    return new window.google.maps.Map(containerElement, defaultOptions);
  },

  // Add marker
  addMarker: (map, position, options = {}) => {
    const defaultOptions = {
      position,
      map,
      title: "Location",
      ...options,
    };

    return new window.google.maps.Marker(defaultOptions);
  },

  // Get directions URL
  getDirectionsUrl: (origin, destination) => {
    const params = new URLSearchParams({
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
    });

    return `https://www.google.com/maps/dir/?${params.toString()}`;
  },

  // Calculate distance between two points
  calculateDistance: (point1, point2) => {
    const service = new window.google.maps.DistanceMatrixService();
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [
            new window.google.maps.LatLng(point1.latitude, point1.longitude),
          ],
          destinations: [
            new window.google.maps.LatLng(
              point2.latitude,
              point2.longitude
            ),
          ],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const result = response.rows[0].elements[0];
            resolve({
              distance: result.distance.text,
              distanceValue: result.distance.value,
              duration: result.duration.text,
              durationValue: result.duration.value,
            });
          } else {
            reject(new Error(`Distance Matrix Error: ${status}`));
          }
        }
      );
    });
  },

  // Reverse geocode (coordinates to address)
  reverseGeocode: (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              resolve({
                address: results[0].formatted_address,
                components: results[0].address_components,
              });
            } else {
              reject(new Error("No results found"));
            }
          } else {
            reject(new Error(`Geocoder Error: ${status}`));
          }
        }
      );
    });
  },

  // Geocode (address to coordinates)
  geocode: (address) => {
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const location = results[0].geometry.location;
            resolve({
              latitude: location.lat(),
              longitude: location.lng(),
              address: results[0].formatted_address,
            });
          } else {
            reject(new Error("No results found"));
          }
        } else {
          reject(new Error(`Geocoder Error: ${status}`));
        }
      });
    });
  },

  // Load Google Maps script dynamically
  loadScript: (apiKey) => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Maps API"));
      
      document.head.appendChild(script);
    });
  },

  // Get bounds from listings
  getBounds: (locations) => {
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((location) => {
      bounds.extend(
        new window.google.maps.LatLng(
          location.coordinates.latitude,
          location.coordinates.longitude
        )
      );
    });
    return bounds;
  },

  // Format address for display
  formatAddress: (address) => {
    return address.substring(0, 50) + (address.length > 50 ? "..." : "");
  },
};
