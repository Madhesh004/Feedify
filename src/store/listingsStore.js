import { create } from "zustand";

export const useListingsStore = create((set, get) => ({
  listings: [],
  bookmarks: [],
  selectedListing: null,
  filters: {
    distance: 50, // km
    search: "",
    availability: "all", // all | available | collected
    foodType: "", // empty string means all
  },
  isLoading: false,
  error: null,

  setListings: (listings) => set({ listings }),
  addListing: (listing) => 
    set((state) => ({ listings: [listing, ...state.listings] })),
  updateListing: (id, updates) =>
    set((state) => ({
      listings: state.listings.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),
  removeListing: (id) =>
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== id),
    })),

  setSelectedListing: (listing) => set({ selectedListing: listing }),
  
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  toggleBookmark: (listingId) =>
    set((state) => {
      const isBookmarked = state.bookmarks.includes(listingId);
      return {
        bookmarks: isBookmarked
          ? state.bookmarks.filter((id) => id !== listingId)
          : [...state.bookmarks, listingId],
      };
    }),

  isBookmarked: (listingId) => get().bookmarks.includes(listingId),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
