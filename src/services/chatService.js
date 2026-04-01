// Chat Service
// Handles real-time direct messaging between users
// Currently uses Firestore, can be enhanced with Socket.IO later

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const chatService = {
  // Create or get conversation between two users
  getOrCreateConversation: async (userId1, userId2) => {
    try {
      const conversationId = [userId1, userId2].sort().join("_");
      return conversationId;
    } catch (error) {
      throw error;
    }
  },

  // Send a message
  sendMessage: async (conversationId, senderId, recipientId, message) => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        conversationId,
        senderId,
        recipientId,
        message,
        timestamp: Timestamp.now(),
        read: false,
      });

      return {
        id: docRef.id,
        conversationId,
        senderId,
        recipientId,
        message,
        timestamp: new Date(),
        read: false,
      };
    } catch (error) {
      throw {
        code: error.code,
        message: "Failed to send message",
      };
    }
  },

  // Subscribe to messages in a conversation
  subscribeToMessages: (conversationId, callback) => {
    try {
      const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messages = [];
          snapshot.forEach((doc) => {
            messages.push({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate(),
            });
          });
          callback(messages);
        },
        (error) => {
          console.error("Error subscribing to messages:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      throw error;
    }
  },

  // Mark message as read
  markMessageAsRead: async (messageId) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        read: true,
      });
    } catch (error) {
      throw error;
    }
  },

  // Get unread count for user
  subscribeToUnreadCount: (userId, callback) => {
    try {
      const q = query(
        collection(db, "messages"),
        where("recipientId", "==", userId),
        where("read", "==", false)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          callback(snapshot.docs.length);
        },
        (error) => {
          console.error("Error getting unread count:", error);
          callback(0);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(error);
      return () => {};
    }
  },

  // Get conversations for a user
  subscribeToConversations: (userId, callback) => {
    try {
      const q = query(
        collection(db, "messages"),
        where("recipientId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const conversations = {};

          snapshot.forEach((doc) => {
            const data = doc.data();
            const conversationId = data.conversationId;

            if (!conversations[conversationId]) {
              conversations[conversationId] = {
                id: conversationId,
                lastMessage: data.message,
                lastTimestamp: data.timestamp?.toDate(),
                participants: [data.senderId, data.recipientId],
                unreadCount: data.read ? 0 : 1,
              };
            } else if (!data.read) {
              conversations[conversationId].unreadCount += 1;
            }
          });

          callback(Object.values(conversations));
        },
        (error) => {
          console.error("Error getting conversations:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      throw error;
    }
  },
};
