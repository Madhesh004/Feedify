import React, { useEffect, useState } from "react";
import { useListingsStore } from "../store/listingsStore";
import { useAuthStore } from "../store/authStore";
import { listingsService } from "../services/listingsService";
import { notificationsService } from "../services/notificationsService";
import { userService } from "../services/userService";
import { ListingCard, ListingDetailModal, ListingGridSkeleton, toast } from "../components";
import { Input, Select } from "../components";
import { Search, MapPin, Filter } from "lucide-react";
import { motion } from "framer-motion";

export const ListingsPage = () => {
  const { user } = useAuthStore();
  const {
    listings,
    selectedListing,
    setSelectedListing,
    setListings,
    filters,
    setFilters,
    bookmarks,
    toggleBookmark,
    isLoading,
    setLoading,
  } = useListingsStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listingsService.subscribeToListings((data) => {
      setListings(data);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      !filters.search ||
      listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType =
      !filters.foodType || listing.foodType === filters.foodType;

    const matchesStatus =
      filters.availability === "all" || listing.status === filters.availability;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleBook = async (listing) => {
    try {
      // Get current user's profile
      const userProfile = await userService.getUserProfile(user.uid);

      // Send notification to listing owner
      await notificationsService.sendPickupRequest(
        listing.id,
        listing.title,
        user.displayName || "Anonymous",
        {
          email: user.email,
          phone: userProfile?.phone || "Not provided",
          location: userProfile?.location || "Not provided",
        }
      );

      toast.success(
        `✅ Pickup request sent to ${listing.hostName}! They will contact you soon.`
      );
      setSelectedListing(null);
    } catch (error) {
      console.error("Error sending pickup request:", error);
      toast.error("Failed to send pickup request. Please try again.");
    }
  };

  const handleClaim = async (listing) => {
    try {
      if (listing.userId === user.uid) {
        toast.error("You cannot claim your own listing");
        return;
      }

      if (listing.status === "claimed") {
        toast.error("This listing has already been claimed");
        return;
      }

      // Get current user's profile for claim details
      const userProfile = await userService.getUserProfile(user.uid);

      // Claim the listing
      const claimDetails = {
        name: user.displayName || "Anonymous",
        email: user.email,
        phone: userProfile?.phone || "Not provided",
      };

      await listingsService.claimListing(listing.id, user.uid, claimDetails);

      toast.success("🎉 You've successfully claimed this food! Please coordinate pickup with the lister.");
      setSelectedListing(null);

      // Update listing in the store
      const updatedListings = listings.map((l) =>
        l.id === listing.id
          ? {
              ...l,
              status: "claimed",
              claimedBy: user.uid,
              claimerName: claimDetails.name,
              claimerEmail: claimDetails.email,
              claimedAt: new Date(),
            }
          : l
      );
      // The real-time subscription will handle the update
    } catch (error) {
      console.error("Error claiming listing:", error);
      const errorMessage = error.message || "Failed to claim listing";
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍽️ Available Food Listings
          </h1>
          <p className="text-gray-600 text-lg">
            {filteredListings.length} listings available near you
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-8 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Food Type Filter */}
            <Select
              label="Food Type"
              value={filters.foodType}
              onChange={(e) => setFilters({ foodType: e.target.value })}
              options={[
                { value: "", label: "All Types" },
                { value: "cooked", label: "Cooked Food" },
                { value: "fresh", label: "Fresh Produce" },
                { value: "bakery", label: "Bakery Items" },
                { value: "packaged", label: "Packaged Food" },
              ]}
            />

            {/* Availability Filter */}
            <Select
              label="Status"
              value={filters.availability}
              onChange={(e) => setFilters({ availability: e.target.value })}
              options={[
                { value: "all", label: "All" },
                { value: "available", label: "Available" },
                { value: "collected", label: "Collected" },
              ]}
            />
          </div>

          {/* Active filters info */}
          {(filters.search || filters.foodType || filters.availability !== "all") && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.foodType && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  {filters.foodType}
                </span>
              )}
              {filters.availability !== "all" && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                  {filters.availability}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Listings Grid */}
        {isLoading ? (
          <ListingGridSkeleton count={6} />
        ) : filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MapPin className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back soon
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDetails={setSelectedListing}
                onBookmark={toggleBookmark}
                isBookmarked={bookmarks.includes(listing.id)}
              />
            ))}
          </motion.div>
        )}

        {/* Detail Modal */}
        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            onBook={() => handleBook(selectedListing)}
            onClaim={handleClaim}
            currentUserId={user.uid}
            isOwnListing={selectedListing.userId === user.uid}
          />
        )}
      </div>
    </div>
  );
};
