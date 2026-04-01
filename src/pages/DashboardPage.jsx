import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { listingsService } from "../services/listingsService";
import { List, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { formatTimeAgo } from "../utils/helpers";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [userListings, setUserListings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    collected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const unsubscribe = listingsService.subscribeToUserListings(
      user.uid,
      (listings) => {
        setUserListings(listings);
        
        setStats({
          total: listings.length,
          active: listings.filter((l) => l.status === "available").length,
          collected: listings.filter((l) => l.status === "collected").length,
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe?.();
  }, [user]);

  const deleteListing = async (listingId) => {
    try {
      await listingsService.deleteListing(listingId);
    } catch (error) {
      console.error("Delete error:", error);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.displayName}!</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <List className="w-10 h-10 text-emerald-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {stats.active}
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Collected</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stats.collected}
                </p>
              </div>
              <Settings className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>
        </motion.div>

        {/* Listings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Listings</h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-600">Loading...</div>
          ) : userListings.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No listings yet. Create your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {listing.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {listing.foodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            listing.status === "available"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTimeAgo(listing.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => deleteListing(listing.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
