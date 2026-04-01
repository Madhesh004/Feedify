import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuthStore } from "../store/authStore";

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
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName || email.split("@")[0],
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
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split("@")[0],
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
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
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
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
        };
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
