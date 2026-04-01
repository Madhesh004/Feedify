import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "../config/firebase";
import { listingsService } from "../services/listingsService";
import { useListingsStore } from "../store/listingsStore";
import { Input, Button, Select, Textarea, LocationInput, toast } from "../components";
import { useGeolocation } from "../hooks";
import { MapPin, Loader, MapIcon } from "lucide-react";
import { motion } from "framer-motion";

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.string().min(1, "Quantity is required"),
  foodType: z.string().min(1, "Food type is required"),
  expiryTime: z.string().optional(),
  pickupTime: z.string().min(1, "Pickup time is required"),
  contactInfo: z.string().min(10, "Valid phone number required"),
  location: z.string().min(3, "Location is required"),
});

export const ListFoodPage = () => {
  const navigate = useNavigate();
  const { addListing } = useListingsStore();
  const { location, getLocation, loading: geoLoading } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(listingSchema),
  });

  const handleGetLocation = () => {
    getLocation();
  };

  const handleGetDirections = () => {
    if (location) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=driving`;
      window.open(mapsUrl, "_blank");
    } else {
      toast.error("Please capture location first");
    }
  };

  const onSubmit = async (data) => {
    console.log("🔵 Form submitted with data:", data);
    
    if (!auth.currentUser) {
      toast.error("Please login first");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("📍 Creating listing with data:", data);
      console.log("📍 User location:", location);
      console.log("📍 Current user:", auth.currentUser?.email);
      console.log("📍 Current user UID:", auth.currentUser?.uid);

      const listingData = {
        title: data.title,
        description: data.description,
        quantity: data.quantity,
        foodType: data.foodType,
        expiryTime: data.expiryTime || null,
        pickupTime: data.pickupTime,
        contactInfo: data.contactInfo,
        location: data.location,
        hostName: auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        status: "available",
        coordinates: location ? {
          latitude: location.latitude,
          longitude: location.longitude
        } : null,
        images: imagePreview ? [imagePreview] : [],
        userId: auth.currentUser.uid,
      };

      console.log("📍 Final listing data to send:", listingData);

      const newListing = await listingsService.createListing(
        listingData,
        auth.currentUser.uid
      );

      console.log("✅ Listing created successfully:", newListing);

      addListing(newListing);
      toast.success("Food listing created successfully!");
      setTimeout(() => navigate("/listings"), 500);
    } catch (error) {
      console.error("❌ Error creating listing:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error message:", error.message);
      console.error("❌ Full error object:", error);
      
      const message = error.message || error.code || "Failed to create listing";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Food</h1>
          <p className="text-gray-600 mb-8">
            Share your surplus food with the community
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6"
          >
            {/* Image Upload */}
            <div
              className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 transition cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Food Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full border border-gray-300 rounded-lg cursor-pointer bg-white p-2"
              />
              {imagePreview && (
                <div className="mt-6 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-lg shadow-md"
                  />
                  <p className="text-xs text-gray-500 mt-2">✓ Image selected and ready to upload</p>
                </div>
              )}
              {!imagePreview && (
                <div className="mt-4 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-4l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-500 text-sm mt-2">Click to upload or drag and drop</p>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Food Title"
                placeholder="e.g., Fresh Vegetables"
                {...register("title")}
                error={errors.title?.message}
              />
              <Select
                label="Food Type"
                {...register("foodType")}
                error={errors.foodType?.message}
                options={[
                  { value: "cooked", label: "Cooked Food" },
                  { value: "fresh", label: "Fresh Produce" },
                  { value: "bakery", label: "Bakery Items" },
                  { value: "packaged", label: "Packaged Food" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Describe your food item..."
              rows="4"
              {...register("description")}
              error={errors.description?.message}
            />

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Quantity"
                placeholder="e.g., 5 kg"
                {...register("quantity")}
                error={errors.quantity?.message}
              />
              <Input
                type="datetime-local"
                label="Expiry Time"
                {...register("expiryTime")}
              />
            </div>

            {/* Location */}
            <div>
              <LocationInput
                label="Pickup Location"
                placeholder="Type to search for location..."
                {...register("location")}
                error={errors.location?.message}
                onLocationSelect={(location) => {
                  setValue("location", location.location);
                }}
              />
              <Button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                variant="secondary"
                className="mt-3 w-full flex items-center justify-center gap-2"
              >
                {geoLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    Or Use Current Location
                  </>
                )}
              </Button>
              {location && (
                <div className="bg-emerald-50 p-3 rounded-lg mt-3">
                  <p className="text-sm text-emerald-700">
                    📍 Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            {/* Contact & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contact Phone"
                type="tel"
                placeholder="Your phone number"
                {...register("contactInfo")}
                error={errors.contactInfo?.message}
              />
              <Input
                type="time"
                label="Pickup Time"
                {...register("pickupTime")}
                error={errors.pickupTime?.message}
              />
            </div>

            {/* Submit */}
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
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
