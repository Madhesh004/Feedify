import React from "react";
import { MapPin, Phone, Clock, Users, MapIcon } from "lucide-react";
import { formatTimeAgo, truncate } from "../utils/helpers";
import { motion } from "framer-motion";

export const ListingCard = ({ listing, onDetails, onBookmark, isBookmarked }) => {
  const imageUrl = listing.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";

  const handleGetDirections = () => {
    if (listing.coordinates) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${listing.coordinates.latitude},${listing.coordinates.longitude}&travelmode=driving`;
      window.open(mapsUrl, "_blank");
    } else if (listing.location) {
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(listing.location)}`;
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold text-emerald-600">
          {listing.status === "available" ? "Available" : "Collected"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {truncate(listing.description, 60)}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-emerald-600 flex-shrink-0" />
            <span className="font-medium">Qty: {listing.quantity}</span>
          </div>
          {listing.expiryTime && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-red-500 flex-shrink-0" />
              <span className="font-medium">Exp: {new Date(listing.expiryTime).toLocaleDateString()}</span>
            </div>
          )}
          {listing.location && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin size={14} className="text-blue-500 flex-shrink-0" />
              <span className="truncate font-medium">{listing.location}</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{formatTimeAgo(listing.createdAt)}</span>
          <span>By {truncate(listing.hostName, 15)}</span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onDetails(listing)}
            className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            View Details
          </button>
          {(listing.coordinates || listing.location) && (
            <button
              onClick={handleGetDirections}
              className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition flex items-center gap-1"
              title="Get directions on Google Maps"
            >
              <MapIcon size={14} />
              
            </button>
          )}
          <button
            onClick={() => onBookmark(listing.id)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
              isBookmarked
                ? "bg-red-50 border-red-200 text-red-600"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {isBookmarked ? "💗" : "🤍"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
