import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, storage } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { userService } from "../services/userService";
import { useAuthStore } from "../store/authStore";
import { Input, Button, Textarea, toast } from "../components";
import { User, Mail, Phone, MapPin, FileText, Loader, Upload } from "lucide-react";
import { motion } from "framer-motion";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  profession: z.string().optional(),
});

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser, updateUserProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Load current profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const profile = await userService.getUserProfile(auth.currentUser.uid);
        
        if (profile) {
          setProfileData(profile);
          setPhotoPreview(profile.photoURL || null);
          setValue("displayName", profile.displayName || auth.currentUser.displayName || "");
          setValue("email", profile.email || auth.currentUser.email || "");
          setValue("bio", profile.bio || "");
          setValue("phone", profile.phone || "");
          setValue("location", profile.location || "");
          setValue("profession", profile.profession || "");
        } else {
          // Initialize with auth data
          setPhotoPreview(auth.currentUser.photoURL || null);
          setValue("displayName", auth.currentUser.displayName || "");
          setValue("email", auth.currentUser.email || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onSubmit = async (data) => {
    if (!auth.currentUser) {
      toast.error("Please login first");
      return;
    }

    setIsSaving(true);
    try {
      let photoURL = auth.currentUser.photoURL || null;

      // Update photo if changed and it's a new photo (data URL from file input)
      if (photoPreview && photoPreview.startsWith("data:")) {
        try {
          setIsUploadingPhoto(true);
          console.log("📸 Starting photo upload to Firebase Storage...");
          
          // Convert data URL to blob
          const response = await fetch(photoPreview);
          const blob = await response.blob();
          
          const photoRef = ref(storage, `user-photos/${auth.currentUser.uid}/${Date.now()}.jpg`);
          console.log("📸 Uploading photo to:", photoRef.fullPath);
          
          await uploadBytes(photoRef, blob);
          photoURL = await getDownloadURL(photoRef);
          
          console.log("✅ Photo uploaded successfully. URL:", photoURL);
          setIsUploadingPhoto(false);
        } catch (photoError) {
          console.error("❌ Photo upload error:", photoError);
          console.error("Error code:", photoError.code);
          setIsUploadingPhoto(false);
          toast.error("Photo upload failed but profile will be saved without photo");
        }
      }

      // Update auth display name and photo
      console.log("🔄 Updating Firebase Auth profile...");
      const authUpdateData = {
        displayName: data.displayName,
      };
      if (photoURL) {
        authUpdateData.photoURL = photoURL;
      }
      await updateProfile(auth.currentUser, authUpdateData);
      console.log("✅ Firebase Auth profile updated");

      // Create or update user profile in Firestore
      console.log("💾 Saving profile to Firestore...");
      const profileData = {
        displayName: data.displayName,
        email: data.email,
        bio: data.bio || "",
        phone: data.phone || "",
        location: data.location || "",
        profession: data.profession || "",
        photoURL: photoURL,
        uid: auth.currentUser.uid,
      };

      await userService.createUserProfile(auth.currentUser.uid, profileData);
      console.log("✅ Profile saved to Firestore");

      // Update local auth store
      updateUserProfile({
        displayName: data.displayName,
        email: data.email,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        profession: data.profession,
        photoURL: photoURL,
      });

      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      console.error("Error message:", error.message);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Profile Photo
            </label>
            <div className="flex items-center gap-6">
              {/* Photo Preview */}
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-emerald-600 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                  <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition cursor-pointer inline-flex items-center gap-2 disabled:opacity-50">
                    <Upload size={16} />
                    {isUploadingPhoto ? "Uploading..." : "Change Photo"}
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6"
          >
            {/* Display Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-emerald-600" />
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  {...register("displayName")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-white text-gray-900 ${
                    errors.displayName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-emerald-500"
                  }`}
                />
                {errors.displayName && (
                  <span className="text-xs text-red-600 mt-1 block">
                    {errors.displayName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-emerald-600" />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-white text-gray-900 ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-emerald-500"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-600 mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                About You
              </label>
              <textarea
                placeholder="Tell us about yourself (max 500 characters)"
                rows="4"
                {...register("bio")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-white text-gray-900 placeholder-gray-500 resize-none ${
                  errors.bio
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {errors.bio && (
                <span className="text-xs text-red-600 mt-1 block">
                  {errors.bio.message}
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
            </div>

            {/* Phone & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-emerald-600" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Optional: Your phone number"
                  {...register("phone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  City/Location
                </label>
                <input
                  type="text"
                  placeholder="Optional: Your city"
                  {...register("location")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession/Occupation
              </label>
              <input
                type="text"
                placeholder="Optional: Your profession"
                {...register("profession")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ <span className="font-medium">Privacy Note:</span> Your profile information is visible to other community members to help build trust. Email and phone are not displayed publicly.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
