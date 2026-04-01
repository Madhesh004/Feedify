import React from "react";
import { X, MapPin, Phone, Users, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const ListingDetailModal = ({ listing, onClose, onBook }) => {
  if (!listing) return null;

  const imageUrl = listing.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Listing Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Image */}
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />

          {/* Title and status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {listing.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Listed by <span className="font-semibold">{listing.hostName}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
              {listing.status === "available" ? "Available" : "Collected"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {listing.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Users size={16} />
                Quantity
              </div>
              <p className="font-semibold text-gray-900">{listing.quantity}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar size={16} />
                Expiry
              </div>
              <p className="font-semibold text-gray-900">
                {listing.expiryTime
                  ? new Date(listing.expiryTime).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Clock size={16} />
                Pickup Time
              </div>
              <p className="font-semibold text-gray-900">
                {listing.pickupTime || "Flexible"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Phone size={16} />
                Contact
              </div>
              <p className="font-semibold text-gray-900">{listing.contactInfo}</p>
            </div>
          </div>

          {/* Location */}
          {listing.location && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-900 mb-2">
                <MapPin size={16} />
                <span className="font-semibold">Pickup Location</span>
              </div>
              <p className="text-blue-900 text-sm">{listing.location}</p>
              {listing.coordinates && (
                <p className="text-xs text-blue-700 mt-1">
                  📍 Lat: {listing.coordinates.latitude.toFixed(4)}, Lon:{" "}
                  {listing.coordinates.longitude.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={onBook}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
            >
              Request Pickup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
