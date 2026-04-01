import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/authService";
import { useAuthStore } from "./store/authStore";
import {
  Header,
  ProtectedRoute,
  ToastProvider,
} from "./components";
import {
  HomePage,
  LoginPage,
  SignupPage,
  ListingsPage,
  ListFoodPage,
  DashboardPage,
  ProfilePage,
} from "./pages";
import { Loader } from "lucide-react";

export default function App() {
  const { isAuthenticated, isLoading, setLoading, setUser } = useAuthStore();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Feedify...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/listings" /> : <LoginPage />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/listings" /> : <SignupPage />}
            />

            {/* Protected Routes */}
            <Route
              path="/listings"
              element={
                <ProtectedRoute>
                  <ListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-food"
              element={
                <ProtectedRoute>
                  <ListFoodPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ToastProvider />
      </div>
    </Router>
  );
}

// Login/Signup modal reused for both roles
function LoginModal({ mode, onClose, onLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password || (isSignup && !form.name)) {
      alert("Please fill the required fields");
      return;
    }
    onLoggedIn(mode);
  }
  const title = isSignup ? (mode === 'list' ? 'Sign up to list' : 'Sign up to view') : (mode === 'list' ? 'Login to list' : 'Login to view list');
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black opacity-30"></div>
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg w-full max-w-md p-6 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="mt-4 grid gap-3 text-sm">
          {isSignup && (
            <label className="flex flex-col">
              Name
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
            </label>
          )}
          <label className="flex flex-col">
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col">
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={() => setIsSignup((s) => !s)} className="text-emerald-700 hover:underline">
            {isSignup ? 'Have an account? Login' : 'No account? Sign up'}
          </button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">{isSignup ? 'Create account' : 'Login'}</button>
        </div>
      </form>
    </div>
  );
}

// Form Modal
function FormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ hostName: "", address: "", phone: "", foodName: "", locationText: "", foodType: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Minimal validation
    if (!form.hostName || !form.foodName) {
      alert('Please provide host name and food name');
      return;
    }
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black opacity-30"></div>
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg w-full max-w-md p-6 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">List Food</h3>
          <button type="button" onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="flex flex-col text-sm">
            Host Name
            <input name="hostName" value={form.hostName} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-sm">
            Address
            <input name="address" value={form.address} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-sm">
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-sm">
            Food Name
            <input name="foodName" value={form.foodName} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-sm">
            Location (text)
            <input name="locationText" value={form.locationText} onChange={handleChange} className="mt-1 border rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-sm">
            Food Type
            <select name="foodType" value={form.foodType} onChange={handleChange} className="mt-1 border rounded px-3 py-2">
              <option value="">Select</option>
              <option>Prepared / Cooked</option>
              <option>Raw / Grocery</option>
              <option>Baked</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex items-center gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">List Food</button>
        </div>
      </form>
    </div>
  );
}

// Detail Modal
function DetailModal({ listing, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative bg-white rounded-lg w-full max-w-lg p-6 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{listing.foodName}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div><strong>Host:</strong> {listing.hostName}</div>
          <div><strong>Phone:</strong> {listing.phone}</div>
          <div><strong>Address:</strong> {listing.address}</div>
          <div><strong>Location text:</strong> {listing.locationText}</div>
          <div><strong>Food type:</strong> {listing.foodType}</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Sample data helper ----------
function sampleListings() {
  return [
    { id: 169, hostName: "John Doe", address: "12, Green Street", phone: "9999999999", foodName: "Cooked Rice", locationText: "Near Community Center", foodType: "Prepared / Cooked" },
    { id: 170, hostName: "Jane Smith", address: "45, Oak Avenue", phone: "8888888888", foodName: "Bread", locationText: "Shopfront", foodType: "Baked" },
  ];
}

