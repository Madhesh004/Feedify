// Application Constants
// Centralized configuration and constant values

export const APP_CONFIG = {
  NAME: "Feedify",
  VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_SOCKET_IO_URL || "http://localhost:3001",
};

// Food Types
export const FOOD_TYPES = [
  { value: "cooked", label: "Cooked Food", emoji: "🍲" },
  { value: "fresh", label: "Fresh Produce", emoji: "🥗" },
  { value: "bakery", label: "Bakery Items", emoji: "🥐" },
  { value: "packaged", label: "Packaged Food", emoji: "📦" },
  { value: "other", label: "Other", emoji: "🍱" },
];

// Listing Status
export const LISTING_STATUS = {
  AVAILABLE: "available",
  COLLECTED: "collected",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};

// Auth Errors
export const AUTH_ERRORS = {
  INVALID_EMAIL: "auth/invalid-email",
  USER_NOT_FOUND: "auth/user-not-found",
  WRONG_PASSWORD: "auth/wrong-password",
  EMAIL_EXISTS: "auth/email-already-in-use",
  WEAK_PASSWORD: "auth/weak-password",
  TOO_MANY_ATTEMPTS: "auth/too-many-requests",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  AUTH_ERROR: "Authentication failed. Please try again.",
  LISTING_ERROR: "Failed to load listings. Please refresh.",
  UPLOAD_ERROR: "Failed to upload image. Please try again.",
  FORM_ERROR: "Please check your form for errors.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LISTING_CREATED: "Food listing created successfully!",
  LISTING_UPDATED: "Listing updated successfully!",
  LISTING_DELETED: "Listing deleted successfully!",
  PICKUP_REQUESTED: "Pickup requested! Check your dashboard.",
  PROFILE_UPDATED: "Profile updated successfully!",
  SIGNUP_SUCCESS: "Account created! Welcome to Feedify.",
  LOGIN_SUCCESS: "Successfully logged in!",
};

// UI Constants
export const UI = {
  TOAST_DURATION: 4000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  ITEMS_PER_PAGE: 12,
  BREAKPOINTS: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
};

// Geolocation
export const GEOLOCATION = {
  DEFAULT_ZOOM: 13,
  DEFAULT_CENTER: {
    latitude: 40.7128,
    longitude: -74.006, // New York
  },
  ACCURACY_THRESHOLD: 100, // meters
};

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2,
  MIN_TITLE_LENGTH: 3,
  MIN_DESCRIPTION_LENGTH: 10,
  MIN_QUANTITY_LENGTH: 1,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};

// Feature Flags (for gradual rollout)
export const FEATURES = {
  MAPS_ENABLED: !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  CHAT_ENABLED: true,
  NOTIFICATIONS_ENABLED: true,
  RATINGS_ENABLED: true,
  BOOKMARKS_ENABLED: true,
  DARK_MODE_ENABLED: true,
  ADVANCED_FILTERS_ENABLED: true,
};

// Default Filters
export const DEFAULT_FILTERS = {
  distance: 50, // km
  search: "",
  availability: "all",
  foodType: "",
};

// Rating Options
export const RATING_OPTIONS = [
  { value: 5, label: "⭐⭐⭐⭐⭐ Excellent" },
  { value: 4, label: "⭐⭐⭐⭐ Good" },
  { value: 3, label: "⭐⭐⭐ Average" },
  { value: 2, label: "⭐⭐ Poor" },
  { value: 1, label: "⭐ Very Poor" },
];

// Time Options for Pickup
export const PICKUP_TIME_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "within-1hr", label: "Within 1 Hour" },
  { value: "within-4hr", label: "Within 4 Hours" },
  { value: "within-8hr", label: "Within 8 Hours" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "flexible", label: "Flexible" },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "closest", label: "Closest to Me" },
  { value: "expiring-soon", label: "Expiring Soon" },
];
