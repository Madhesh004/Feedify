import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { Utensils, MapPin, Users, TrendingUp, CheckCircle, AlertCircle, Zap } from "lucide-react";

export const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Utensils,
      title: "List Food",
      description: "Share your surplus food with the community instantly",
    },
    {
      icon: MapPin,
      title: "Find Nearby",
      description: "Discover food listings near you with real-time updates",
    },
    {
      icon: Users,
      title: "Connect",
      description: "Communicate securely with food providers and collectors",
    },
    {
      icon: TrendingUp,
      title: "Reduce Waste",
      description: "Help reduce food waste and build a sustainable community",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Share Food, <span className="text-emerald-600">Share Hope</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with your community to share surplus food, reduce waste, and
            ensure no one goes hungry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/listings"
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  View Listings
                </Link>
                <Link
                  to="/list-food"
                  className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
                >
                  List Food Now
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Latest Updates */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">📰 Latest Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Update 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-sm border border-emerald-100"
            >
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Food Listed Today</p>
                  <p className="text-sm text-gray-500">Fresh vegetables from Zolo Sereno</p>
                </div>
              </div>
              <p className="text-gray-700">2 kg of fresh vegetables shared with the community. Help reduce food waste!</p>
              <p className="text-xs text-gray-500 mt-3">📍 Zolo Sereno • 👥 Available for pickup</p>
            </motion.div>

            {/* Update 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm border border-blue-100"
            >
              <div className="flex items-start gap-3 mb-3">
                <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Real-Time Map Enabled</p>
                  <p className="text-sm text-gray-500">Find food near you instantly</p>
                </div>
              </div>
              <p className="text-gray-700">Search for food listings and see them on an interactive map. Know exactly where to pick up!</p>
              <p className="text-xs text-gray-500 mt-3">🗺️ Live locations • 🎯 Smart filtering</p>
            </motion.div>

            {/* Update 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-sm border border-purple-100"
            >
              <div className="flex items-start gap-3 mb-3">
                <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Community Impact</p>
                  <p className="text-sm text-gray-500">Reducing food waste together</p>
                </div>
              </div>
              <p className="text-gray-700">Every listing prevents food from going to landfill. Connect with neighbors and build a sustainable community!</p>
              <p className="text-xs text-gray-500 mt-3">♻️ Zero waste • 🤝 Neighbor to neighbor</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How Feedify Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of community members sharing food and reducing waste.
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
