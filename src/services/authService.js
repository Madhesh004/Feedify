import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuthStore } from "../store/authStore";
import { userService } from "./userService";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Sign up with email/password
  signup: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const finalDisplayName = displayName || email.split("@")[0];

      // Update auth profile
      await updateProfile(user, {
        displayName: finalDisplayName,
      });

      // Create user profile in Firestore
      await userService.ensureUserProfileExists(user.uid, {
        email: user.email,
        displayName: finalDisplayName,
      });
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: finalDisplayName,
      };
    } catch (error) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  },

  // Sign in with email/password
  signin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const displayName = user.displayName || email.split("@")[0];

      // Ensure user profile exists in Firestore
      await userService.ensureUserProfileExists(user.uid, {
        email: user.email,
        displayName: displayName,
      });
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      };
    } catch (error) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || user.email.split("@")[0];

      // Ensure user profile exists in Firestore
      await userService.ensureUserProfileExists(user.uid, {
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
      });
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      throw {
        code: error.code,
        message: error.message,
      };
    }
  },

  // Sign out
  logout: async () => {
    try {
      await signOut(auth);
      useAuthStore.getState().logout();
    } catch (error) {
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const displayName = user.displayName || user.email.split("@")[0];
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
        };

        // Ensure user profile exists in Firestore
        try {
          await userService.ensureUserProfileExists(user.uid, {
            email: user.email,
            displayName: displayName,
            photoURL: user.photoURL || "",
          });
        } catch (error) {
          console.error("Error ensuring user profile on auth state change:", error);
        }

        useAuthStore.getState().setUser(userData);
        callback(userData);
      } else {
        useAuthStore.getState().logout();
        callback(null);
      }
    });
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,
};
