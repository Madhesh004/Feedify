// User Service
// Handles user profile and preference management

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const userService = {
  // Create or update user profile
  createUserProfile: async (userId, profileData) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          ...profileData,
          userId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      throw {
        code: error.code,
        message: "Failed to create profile",
      };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
          createdAt: snapshot.data().createdAt?.toDate(),
          updatedAt: snapshot.data().updatedAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        preferences,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw error;
    }
  },

  // Add to user bookmarks
  addBookmark: async (userId, listingId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const bookmarks = userDoc.data().bookmarks || [];
        if (!bookmarks.includes(listingId)) {
          await updateDoc(userRef, {
            bookmarks: [...bookmarks, listingId],
          });
        }
      }
    } catch (error) {
      throw error;
    }
  },

  // Remove from bookmarks
  removeBookmark: async (userId, listingId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const bookmarks = userDoc.data().bookmarks || [];
        const filtered = bookmarks.filter((id) => id !== listingId);
        await updateDoc(userRef, {
          bookmarks: filtered,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  // Get user's bookmarks
  getUserBookmarks: async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().bookmarks || [];
      }
      return [];
    } catch (error) {
      throw error;
    }
  },

  // Add or update user rating
  rateUser: async (raterId, ratedUserId, rating, review) => {
    try {
      const reviewRef = collection(db, "userReviews");
      await addDoc(reviewRef, {
        raterId,
        ratedUserId,
        rating: Math.min(5, Math.max(1, rating)), // Ensure 1-5
        review,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      throw error;
    }
  },

  // Get user's average rating
  getUserRating: async (userId) => {
    try {
      const reviewsRef = collection(db, "userReviews");
      const q = query(where("ratedUserId", "==", userId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { average: 0, count: 0 };
      }

      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().rating;
      });

      return {
        average: total / snapshot.docs.length,
        count: snapshot.docs.length,
      };
    } catch (error) {
      throw error;
    }
  },

  // Ensure user profile exists (call after auth sign-in)
  ensureUserProfileExists: async (userId, userData) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create a new profile
        await setDoc(userRef, {
          userId,
          email: userData.email || "",
          displayName: userData.displayName || "",
          photoURL: userData.photoURL || "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          phone: "",
          location: "",
          bio: "",
          bookmarks: [],
          preferences: {},
        });
      } else {
        // Update last login
        await updateDoc(userRef, {
          updatedAt: Timestamp.now(),
        });
      }

      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      throw {
        code: error.code || "profile-error",
        message: error.message || "Failed to ensure user profile",
      };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw {
        code: error.code,
        message: "Failed to update profile",
      };
    }
  },
};
