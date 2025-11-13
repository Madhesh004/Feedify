import React, { useState, useEffect } from "react";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [route, setRoute] = useState("landing"); // landing | list | view | login
  const [listings, setListings] = useState(sampleListings());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  // Simple local auth: separate roles for lister and viewer
  const [auth, setAuth] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("feedifyAuth") || "{}");
      return { lister: !!saved.lister, viewer: !!saved.viewer };
    } catch {
      return { lister: false, viewer: false };
    }
  });
  const [loginFor, setLoginFor] = useState(null); // 'list' | 'view' | null
  const [requestedRoute, setRequestedRoute] = useState(null);

  useEffect(() => {
    localStorage.setItem("feedifyAuth", JSON.stringify(auth));
  }, [auth]);

  function requireAuthAndNavigate(targetRoute) {
    if (targetRoute === "list" && !auth.lister) {
      setRequestedRoute(targetRoute);
      setLoginFor("list");
      return;
    }
    if (targetRoute === "view" && !auth.viewer) {
      setRequestedRoute(targetRoute);
      setLoginFor("view");
      return;
    }
    setRoute(targetRoute);
  }

  function addListing(payload) {
    setListings((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    setIsFormOpen(false);
    setRoute("view");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 bg-white w-64 shadow-lg z-30`}>
          <div className="p-4">
            <h2 className="text-xl font-bold text-black">Feedify</h2>
            <nav className="mt-6 flex flex-col gap-2">
              <button onClick={() => { setRoute('landing'); setSidebarOpen(false); }} className={`text-left px-3 py-2 rounded ${route==='landing'? 'bg-emerald-50':''}`}>Home</button>
              <button onClick={() => { requireAuthAndNavigate('list'); setSidebarOpen(false); }} className={`text-left px-3 py-2 rounded ${route==='list'? 'bg-emerald-50':''}`}>List Food</button>
              <button onClick={() => { requireAuthAndNavigate('view'); setSidebarOpen(false); }} className={`text-left px-3 py-2 rounded ${route==='view'? 'bg-emerald-50':''}`}>View Listings</button>
              <button onClick={() => { setRoute('login'); setSidebarOpen(false); }} className={`text-left px-3 py-2 rounded ${route==='login'? 'bg-emerald-50':''}`}>Login</button>
            </nav>
          </div>
        </aside>

        {/* Overlay when sidebar open */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-30 z-20"></div>}

        {/* Main content area */}
        <div className="flex-1 min-h-screen">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded bg-white shadow">
                ☰
              </button>
              <h1 className="text-2xl font-extrabold text-black">Feedify</h1>
            </div>
          </header>

          <main>
            {route === "landing" && (
              <Landing onNavigate={(r) => requireAuthAndNavigate(r)} />
            )}

            {route === "list" && (
              <ListFoodPage 
                onOpenForm={() => setIsFormOpen(true)} 
                listings={listings}
              />
            )}

            {route === "view" && (
              <ViewListingsPage 
                listings={listings} 
                onOpenDetail={(l) => setSelectedListing(l)}
              />
            )}

            {route === "login" && (
              <LoginPage 
                onLoginClick={(mode) => setLoginFor(mode)}
                auth={auth}
              />
            )}
          </main>
          </div>

          {/* Floating plus for List Food page */}
          {route === "list" && (
            <button onClick={() => setIsFormOpen(true)} aria-label="Add listing" className="fixed right-8 bottom-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg">+</button>
          )}

          {/* Modals */}
          {isFormOpen && (
            <FormModal onClose={() => setIsFormOpen(false)} onSubmit={addListing} />
          )}

          {selectedListing && (
            <DetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
          )}

          {loginFor && (
            <LoginModal 
              mode={loginFor}
              onClose={() => setLoginFor(null)}
              onLoggedIn={(mode) => {
                setAuth((prev) => ({ ...prev, [mode === 'list' ? 'lister' : 'viewer']: true }));
                const dest = requestedRoute || (mode === 'list' ? 'list' : 'view');
                setRequestedRoute(null);
                setLoginFor(null);
                setRoute(dest);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------- Components -----------------
function Landing({ onNavigate }) {
  return (
    <section className="max-w-4xl mx-auto text-center py-20">
      <h2 className="text-5xl font-extrabold text-black">Feedify</h2>
      <p className="mt-4 text-gray-600">Share surplus food. Reduce waste. Help your community.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => onNavigate('list')} title="List Food" description="Host a food item you want to donate. Quick form." />
        <Card onClick={() => onNavigate('view')} title="View Listings" description="Browse available food items and request pickup." />
      </div>

      
    </section>
  );
}

function Card({ title, description, onClick }) {
  return (
    <button onClick={onClick} className="bg-white shadow rounded-lg p-6 text-left hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-emerald-600">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </button>
  );
}

function ListFoodPage({ onOpenForm, listings }) {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">List Food</h2>
        <button onClick={onOpenForm} className="flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded">+
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {listings.length === 0 && <div className="text-gray-500">No listings yet. Click + to create one.</div>}
        {listings.map((l) => (
          <div key={l.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
            <div>
              <div className="font-semibold">{l.foodName}</div>
              <div className="text-sm text-gray-500">Host: {l.hostName} • {l.locationText}</div>
              <div className="text-xs text-gray-400 mt-1">Added: {new Date(l.id).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{l.foodType}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ViewListingsPage({ listings, onOpenDetail }) {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">Available Listings</h2>

      <div className="mt-6 grid gap-4">
        {listings.length === 0 && <div className="text-gray-500">No listings available.</div>}

        {listings.map((l) => (
          <article key={l.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold text-emerald-700">{l.foodName} <span className="text-sm text-gray-500">({l.foodType})</span></div>
              <div className="text-sm text-gray-600">{l.locationText} — {l.address}</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button onClick={() => onOpenDetail(l)} className="px-3 py-1 bg-emerald-600 text-white rounded">Details</button>
              <div className="text-xs text-gray-500">{l.phone}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Login landing with two buttons opening respective modals
function LoginPage({ onLoginClick, auth }) {
  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Login</h2>
      <p className="mt-2 text-gray-600">Choose how you want to continue.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => onLoginClick('list')} className="bg-white p-5 rounded shadow hover:shadow-md text-left">
          <div className="font-semibold text-emerald-700">Login to list</div>
          <div className="text-sm text-gray-600 mt-1">Create and manage your food listings.</div>
          {auth.lister && <div className="mt-2 inline-block text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Already logged in</div>}
        </button>
        <button onClick={() => onLoginClick('view')} className="bg-white p-5 rounded shadow hover:shadow-md text-left">
          <div className="font-semibold text-emerald-700">Login to view list</div>
          <div className="text-sm text-gray-600 mt-1">Browse and request pickup.</div>
          {auth.viewer && <div className="mt-2 inline-block text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Already logged in</div>}
        </button>
      </div>
    </section>
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

