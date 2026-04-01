# 🍱 Feedify - Modern Real-Time Food Sharing Platform

> Transform surplus food into community wealth through an intelligent, real-time food sharing platform.

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-10.11-FFA500?logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 📸 Overview

Feedify is a **production-ready, real-time web platform** that connects food sharers with community members. Food is shared in seconds, waste is eliminated, and communities are strengthened.

**Key Highlights:**
- ⚡ Real-time listings with instant synchronization
- 🔐 Secure Firebase authentication
- 📍 Geolocation support for food discovery
- 📱 Mobile-responsive design
- 🎨 Modern, beautiful UI with animations
- 🚀 Zero-configuration deployment ready

---

## ✨ Features

### 🔐 Authentication & Security
- Secure email/password authentication via Firebase
- Persistent user sessions
- Protected routes and data access
- Industry-standard security practices

### ⚡ Real-Time Features
- Live food listing feed
- Instant updates without page refresh
- Firestore real-time synchronization
- Offline data persistence

### 🎯 Core Features
- ✅ Create and manage food listings
- ✅ Browse available food in real-time
- ✅ Filter by food type and status
- ✅ Search functionality
- ✅ Bookmark favorite listings
- ✅ User dashboard with analytics
- ✅ Geolocation capture
- ✅ Image uploads

### 🎨 User Experience
- Responsive mobile-first design
- Smooth animations and transitions
- Loading skeletons for better UX
- Toast notifications for feedback
- Intuitive user interface
- Accessible components

### 📚 Developer Experience
- Clean, modular code architecture
- Comprehensive API documentation
- Reusable component library
- Custom hooks
- Best practices implemented
- Extensive documentation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account

### 1. Setup in 5 Minutes

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Firebase credentials to .env
# Then start development server
npm run dev
```

### 2. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Copy credentials to `.env`

### 3. Apply Security Rules
Copy content from `firebase-rules.txt` to Firebase Console → Firestore Rules

### 4. Start Building!
Open [http://localhost:5173](http://localhost:5173)

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | **START HERE** - Overview of upgrade |
| [SETUP.md](./SETUP.md) | Quick setup guide (5 minutes) |
| [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) | Comprehensive feature guide |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API documentation |
| [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) | Future enhancements guide |
| [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) | How to extend Feedify |

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19.2 (UI framework)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Hook Form + Zod (forms)

**Backend & Database:**
- Firebase Authentication
- Firebase Firestore
- Firebase Cloud Storage

**State Management:**
- Zustand (lightweight store)

**UI Components:**
- Lucide React (icons)
- Sonner (notifications)
- Custom components

### Folder Structure

```
Feedify/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API & data services
│   ├── store/          # Zustand state stores
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utilities & constants
│   └── config/         # Configuration
├── public/             # Static assets
├── .env.example        # Environment template
└── [documentation files]
```

---

## 🎯 Core Services

### Authentication Service
```javascript
import { authService } from './services/authService';

// Signup
const user = await authService.signup(email, password, name);

// Login
const user = await authService.signin(email, password);

// Logout
await authService.logout();
```

### Listings Service
```javascript
import { listingsService } from './services/listingsService';

// Create listing
const listing = await listingsService.createListing(data, userId);

// Real-time updates
const unsubscribe = listingsService.subscribeToListings((listings) => {
  console.log('Updated listings:', listings);
});

// Cleanup
unsubscribe();
```

### State Management
```javascript
import { useAuthStore } from './store/authStore';
import { useListingsStore } from './store/listingsStore';

// Use auth state
const { user, isAuthenticated } = useAuthStore();

// Use listings state
const { listings, filters } = useListingsStore();
```

## 📱 Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page |
| Signup | `/signup` | User registration |
| Login | `/login` | User authentication |
| Listings | `/listings` | Browse food listings |
| List Food | `/list-food` | Create new listing |
| Dashboard | `/dashboard` | User dashboard |

---

## 🎨 UI Components

Pre-built components ready for use:

- **Header** - Navigation with auth
- **Button** - Styled button with variants
- **Input** - Form input with validation
- **Select** - Dropdown select
- **Textarea** - Multi-line text input
- **ListingCard** - Food listing display
- **ListingDetailModal** - Full listing details
- **MapPicker** - Location selection
- **ProtectedRoute** - Auth guard
- **Skeletons** - Loading states

---

## 📊 Data Models

### Listing Document
```javascript
{
  id: string,
  title: string,
  description: string,
  foodType: "cooked" | "fresh" | "bakery" | "packaged",
  quantity: string,
  status: "available" | "collected",
  expiryTime: timestamp,
  pickupTime: string,
  contactInfo: string,
  location: string,
  coordinates: { latitude: number, longitude: number },
  images: [string],
  userId: string,
  hostName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Alternative Hosting
- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Amplify Console
- **GitHub Pages**: Static hosting

---

## 📈 Performance

✅ Real-time sync (Firestore)
✅ Code splitting ready
✅ Lazy loading components
✅ Skeleton loading states
✅ Image lazy loading
✅ Debounced search
✅ Optimized bundle size

---

## 🔒 Security

✅ Firebase Authentication
✅ Firestore security rules
✅ Environment variable protection
✅ Input validation (Zod)
✅ Protected routes
✅ HTTPS/SSL via Firebase
✅ Error boundaries
✅ XSS protection

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 🐛 Troubleshooting

### Firebase Not Connecting?
- Check `.env` file has all required variables
- Verify project ID matches Firebase Console
- Check Firestore is created

### Auth Not Working?
- Enable Email/Password in Firebase Console
- Check email format is valid
- Verify network connection

### Listings Not Loading?
- Check Firestore is created
- Apply security rules from `firebase-rules.txt`
- Verify browser console for errors

See [SETUP.md](./SETUP.md#troubleshooting) for more solutions.

---

## 🗺️ Future Roadmap

- [x] Real-time listings
- [x] User authentication
- [x] Responsive design
- [ ] Google Maps integration
- [ ] Real-time chat
- [ ] Push notifications
- [ ] Rating system
- [ ] Advanced analytics

See [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for details.

---

## 📄 License

MIT License © 2026 - See LICENSE file for details

---

## 🆘 Support

- 📖 Read the documentation
- 🐛 Check [SETUP.md](./SETUP.md#troubleshooting)
- 💬 Review API [API_REFERENCE.md](./API_REFERENCE.md)
- ⚙️ See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)

---

## 🎯 Quick Links

- [Project Summary](./PROJECT_SUMMARY.md) - What's new
- [Quick Setup](./SETUP.md) - Get started fast
- [API Reference](./API_REFERENCE.md) - Developer guide
- [Customization](./CUSTOMIZATION_GUIDE.md) - Make it yours
- [Advanced Features](./ADVANCED_FEATURES.md) - Future enhancements

---

## 🌟 Show Your Support

If you found this helpful, please ⭐ star the repository!

---

**Built with ❤️ to reduce food waste and strengthen communities.**

*Transform surplus food into community wealth.*
