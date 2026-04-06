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

  // Send claim notification to listing owner
  sendClaimNotification: async (listingId, listingTitle, listingOwnerId, claimerDetails) => {
    try {
      console.log("📧 Sending claim notification for listing:", listingId);
      
      const notification = {
        listingId,
        listingOwnerId,
        type: "food_claimed",
        title: `🎉 Your food has been claimed!`,
        message: `${claimerDetails.name} has claimed your food listing: "${listingTitle}". They will contact you soon at ${claimerDetails.phone}.`,
        claimerName: claimerDetails.name,
        claimerEmail: claimerDetails.email,
        claimerPhone: claimerDetails.phone,
        senderId: claimerDetails.userId,
        read: false,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, "notifications"), notification);
      console.log("✅ Claim notification created:", docRef.id);
      
      return {
        id: docRef.id,
        ...notification,
      };
    } catch (error) {
      console.error("❌ Error sending claim notification:", error);
      throw {
        code: error.code,
        message: "Failed to send claim notification",
      };
    }
  },

  // Send notification to claimer
  sendClaimerNotification: async (listingId, listingTitle, claimerId, listingOwnerDetails) => {
    try {
      console.log("📧 Sending claimer confirmation notification");
      
      const notification = {
        listingId,
        userId: claimerId,
        type: "claim_confirmed",
        title: `✅ Successfully claimed "${listingTitle}"`,
        message: `You've claimed the food. Contact the owner ${listingOwnerDetails.name} to arrange pickup. Phone: ${listingOwnerDetails.phone}`,
        ownerName: listingOwnerDetails.name,
        ownerEmail: listingOwnerDetails.email,
        ownerPhone: listingOwnerDetails.phone,
        senderId: listingOwnerDetails.userId,
        read: false,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, "notifications"), notification);
      console.log("✅ Claimer notification created:", docRef.id);
      
      return {
        id: docRef.id,
        ...notification,
      };
    } catch (error) {
      console.error("❌ Error sending claimer notification:", error);
      throw {
        code: error.code,
        message: "Failed to send claimer notification",
      };
    }
  },

  // Subscribe to user's notifications (both as owner and claimer)
  subscribeToAllNotifications: (userId, callback) => {
    try {
      // Subscribe to both owner notifications and claimer notifications
      const ownerNotificationsUnsub = onSnapshot(
        query(collection(db, "notifications"), where("listingOwnerId", "==", userId)),
        (snapshot) => {
          const notifications = [];
          snapshot.forEach((doc) => {
            notifications.push({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
              requestedAt: doc.data().requestedAt?.toDate(),
            });
          });
          callback(notifications);
        }
      );

      return ownerNotificationsUnsub;
    } catch (error) {
      console.error("❌ Error in subscribeToAllNotifications:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        deleted: true,
      });
    } catch (error) {
      throw error;
    }
  },
};
