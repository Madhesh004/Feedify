// Notification Service
// Handles in-app notifications, local notifications, and future push notifications

import { toast } from "../components";

export const notificationService = {
  // Success notification
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      ...options,
    });
  },

  // Error notification
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      ...options,
    });
  },

  // Info notification
  info: (message, options = {}) => {
    return toast.info(message, {
      duration: 4000,
      ...options,
    });
  },

  // Warning notification
  warning: (message, options = {}) => {
    return toast.warning(message, {
      duration: 4000,
      ...options,
    });
  },

  // Loading notification (placeholder - Sonner doesn't have native loading)
  loading: (message) => {
    return toast.loading(message);
  },

  // Dismiss notification
  dismiss: (id) => {
    toast.dismiss(id);
  },

  // Browser notification (requires permission)
  browserNotification: async (title, options = {}) => {
    try {
      // Request permission if not granted
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (Notification.permission === "granted") {
        new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        });
      }
    } catch (error) {
      console.error("Browser notification error:", error);
    }
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    try {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        return permission === "granted";
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  },

  // Check if notification available
  isNotificationAvailable: () => {
    return "Notification" in window && Notification.permission === "granted";
  },
};

// Notification types for consistent messaging
export const notificationTypes = {
  LISTING_CREATED: "Listing created successfully!",
  LISTING_UPDATED: "Listing updated successfully!",
  LISTING_DELETED: "Listing deleted successfully!",
  PICKUP_REQUESTED: "Pickup requested! Check your dashboard.",
  AUTH_SUCCESS: "Successfully logged in!",
  AUTH_ERROR: "Authentication failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  VALIDATION_ERROR: "Please check your form for errors.",
};
