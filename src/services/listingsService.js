import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useListingsStore } from "../store/listingsStore";

export const listingsService = {
  // Create a new listing
  createListing: async (data, userId) => {
    try {
      console.log("🔥 [createListing] Starting listing creation");
      console.log("🔥 [createListing] DB Reference:", db);
      console.log("🔥 [createListing] User ID:", userId);
      console.log("🔥 [createListing] Data:", data);
      
      const listingData = {
        ...data,
        userId,
        status: "available",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      console.log("🔥 [createListing] Prepared data for Firestore:", listingData);
      
      const collectRef = collection(db, "listings");
      console.log("🔥 [createListing] Collection reference created:", collectRef.path);
      
      const docRef = await addDoc(collectRef, listingData);
      
      console.log("✅ [createListing] Success! Listing created with ID:", docRef.id);
      
      return { 
        id: docRef.id, 
        ...listingData 
      };
    } catch (error) {
      console.error("❌ [createListing] Error occurred:");
      console.error("   Code:", error.code);
      console.error("   Message:", error.message);
      console.error("   Full error:", error);
      
      // Handle specific Firestore errors
      if (error.code === "permission-denied") {
        throw {
          code: error.code,
          message: "Permission denied. Please check Firestore security rules or ensure you're logged in.",
        };
      }
      
      if (error.code === "failed-precondition") {
        throw {
          code: error.code,
          message: "Firestore is not initialized properly. Please refresh the page.",
        };
      }
      
      throw {
        code: error.code || "unknown",
        message: error.message || "Failed to create listing",
      };
    }
  },

  // Get all listings with real-time updates
  subscribeToListings: (callback) => {
    try {
      console.log("📡 Subscribing to listings...");
      const q = query(
        collection(db, "listings"),
        where("status", "==", "available"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log("📡 Listings snapshot received, count:", snapshot.size);
          const listings = [];
          snapshot.forEach((doc) => {
            const listingData = {
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate(),
            };
            console.log("📡 Listing:", doc.id, listingData);
            listings.push(listingData);
          });
          useListingsStore.getState().setListings(listings);
          callback(listings);
        },
        (error) => {
          console.error("❌ Error subscribing to listings:", error);
          useListingsStore.getState().setError(error.message);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("❌ Error in subscribeToListings:", error);
      throw error;
    }
  },

  // Get user's listings
  subscribeToUserListings: (userId, callback) => {
    try {
      const q = query(
        collection(db, "listings"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const listings = [];
          snapshot.forEach((doc) => {
            listings.push({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate(),
            });
          });
          callback(listings);
        },
        (error) => {
          console.error("Error subscribing to user listings:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      throw error;
    }
  },

  // Update listing
  updateListing: async (listingId, data) => {
    try {
      const listingRef = doc(db, "listings", listingId);
      await updateDoc(listingRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw {
        code: error.code,
        message: "Failed to update listing",
      };
    }
  },

  // Delete listing
  deleteListing: async (listingId) => {
    try {
      await deleteDoc(doc(db, "listings", listingId));
    } catch (error) {
      throw {
        code: error.code,
        message: "Failed to delete listing",
      };
    }
  },

  // Get single listing
  getListing: async (listingId) => {
    try {
      const docRef = doc(db, "listings", listingId);
      const snapshot = await getDocs(query(where("__name__", "==", listingId)));
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        return {
          id: snapshot.docs[0].id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
};
