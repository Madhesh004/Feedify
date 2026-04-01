// Notifications Service
// Handles pickup request notifications

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const notificationsService = {
  // Send pickup request notification
  sendPickupRequest: async (listingId, listingTitle, requesterName, requesterData) => {
    try {
      const notification = {
        listingId,
        type: "pickup_request",
        title: `${requesterName} requested to pick up "${listingTitle}"`,
        message: `${requesterName} is ready to pick up your food listing. Contact info: ${requesterData.phone || "Not provided"}`,
        requesterName,
        requesterEmail: requesterData.email,
        requesterPhone: requesterData.phone,
        requesterLocation: requesterData.location,
        listingOwnerId: null, // Will be set when listing fetched
        requestedAt: Timestamp.now(),
        read: false,
        status: "pending",
      };
      
      const docRef = await addDoc(collection(db, "notifications"), notification);
      console.log("✅ Notification created:", docRef.id);
      
      return {
        id: docRef.id,
        ...notification,
      };
    } catch (error) {
      console.error("❌ Error sending notification:", error);
      throw {
        code: error.code,
        message: "Failed to send notification",
      };
    }
  },

  // Subscribe to user notifications
  subscribeToNotifications: (userId, callback) => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("listingOwnerId", "==", userId)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const notifications = [];
          snapshot.forEach((doc) => {
            notifications.push({
              id: doc.id,
              ...doc.data(),
              requestedAt: doc.data().requestedAt?.toDate(),
            });
          });
          callback(notifications);
        },
        (error) => {
          console.error("❌ Error subscribing to notifications:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("❌ Error in subscribeToNotifications:", error);
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
    } catch (error) {
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("listingOwnerId", "==", userId),
        where("read", "==", false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  },
};
