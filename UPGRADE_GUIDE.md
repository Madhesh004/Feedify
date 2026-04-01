# Feedify - Modern Food Sharing Platform

> A production-ready real-time food sharing platform built with React, Firebase, and modern web technologies.

## 🚀 Features

### Authentication & Authorization
- ✅ Secure Firebase authentication (Email/Password)
- ✅ Persistent user sessions
- ✅ Protected routes
- ✅ Role-based access control

### Real-Time Features
- ✅ Live food listings with real-time sync
- ✅ Instant updates when new food is posted
- ✅ Firebase Firestore for real-time database
- ✅ Offline support with persistence

### User Experience
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Mobile-first design
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications for user feedback
- ✅ Loading states and skeletons

### Food Listing Features
- ✅ Rich food listing with details (title, description, quantity, expiry, location)
- ✅ Image upload support
- ✅ Geolocation capture
- ✅ Food type categorization
- ✅ Pickup time scheduling

### Listing Discovery
- ✅ Filter by food type, availability status
- ✅ Search functionality
- ✅ Bookmark/Save listings
- ✅ Listing details modal with full information

### Dashboard
- ✅ User dashboard with statistics
- ✅ Manage your listings
- ✅ Track active and collected items
- ✅ Edit/delete listings

## 📋 Tech Stack

**Frontend:**
- React 19.2
- React Router v6 (routing)
- TypeScript support (ready)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Hook Form + Zod (form validation)
- Sonner (toast notifications)

**Backend & Database:**
- Firebase (Authentication, Firestore, Storage)
- Real-time Firestore updates
- Cloud Storage for images

**State Management:**
- Zustand (lightweight state)
- React Context API ready

**Maps (Optional):**
- @react-google-maps/api (ready for integration)

**UI Components:**
- Lucide React (icons)
- Custom reusable components

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase project account
- Google Maps API key (optional, for maps integration)

### 1. Clone and Install Dependencies

```bash
cd Feedify
npm install
```

### 2. Firebase Setup

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication:**
   - In Firebase Console → Authentication
   - Enable "Email/Password" sign-in method

3. **Create Firestore Database:**
   - In Firebase Console → Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
   - Select your region

4. **Enable Cloud Storage:**
   - In Firebase Console → Storage
   - Create a bucket

5. **Get Your Credentials:**
   - Project Settings → Your apps → Web
   - Copy the Firebase config

### 3. Environment Setup

Create a `.env` file in the project root:

```bash
# Copy the example
cp .env.example .env
```

Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url

VITE_GOOGLE_MAPS_API_KEY=your_maps_key (optional)
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── ListingCard.jsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── ListingsPage.jsx
│   ├── ListFoodPage.jsx
│   ├── DashboardPage.jsx
│   └── ...
├── services/           # API & Firebase services
│   ├── authService.js
│   ├── listingsService.js
│   └── ...
├── store/              # State management (Zustand)
│   ├── authStore.js
│   ├── listingsStore.js
│   └── ...
├── hooks/              # Custom React hooks
│   └── index.js
├── utils/              # Utility functions
│   └── helpers.js
├── config/             # Configuration files
│   └── firebase.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🔄 Data Models

### Listing Document (Firestore)
```javascript
{
  id: string,
  title: string,
  description: string,
  foodType: "cooked" | "fresh" | "bakery" | "packaged" | "other",
  quantity: string,
  status: "available" | "collected" | "expired",
  expiryTime: timestamp | null,
  pickupTime: string,
  contactInfo: string,
  location: string,
  coordinates: {
    latitude: number,
    longitude: number
  } | null,
  images: string[],
  userId: string,
  hostName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### User Data
```javascript
{
  uid: string,
  email: string,
  displayName: string
}
```

## 🎯 API Reference

### Authentication Service
```javascript
// Sign up
authService.signup(email, password, displayName)

// Sign in
authService.signin(email, password)

// Sign out
authService.logout()

// Listen to auth changes
authService.onAuthStateChange(callback)
```

### Listings Service
```javascript
// Create listing
listingsService.createListing(data, userId)

// Subscribe to all listings (real-time)
listingsService.subscribeToListings(callback)

// Subscribe to user's listings (real-time)
listingsService.subscribeToUserListings(userId, callback)

// Update listing
listingsService.updateListing(listingId, data)

// Delete listing
listingsService.deleteListing(listingId)
```

## 🎨 UI Components

### Button
```jsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Input
```jsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register("email")}
/>
```

### Protected Route
```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Listing Card
```jsx
<ListingCard
  listing={listing}
  onDetails={handleDetails}
  onBookmark={handleBookmark}
  isBookmarked={isBookmarked}
/>
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist` directory.

### Deploy to Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Alternative Hosting Options
- Vercel: `vercel deploy`
- Netlify: Connect your GitHub repo
- AWS Amplify
- GitHub Pages

## 🔒 Security Considerations

1. **Firebase Security Rules:**
   - Always set appropriate Firestore rules for production
   - Restrict user access to their own data
   - Example rules in `firebase-rules.txt`

2. **Environment Variables:**
   - Never commit `.env` to version control
   - Use `.env.local` for local development
   - Set environment variables in deployment platform

3. **Data Validation:**
   - All form inputs validated with Zod
   - Firebase enforces additional server-side validation

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Firebase Connection Issues
- Check your `.env` variables
- Verify Firebase project is active
- Check browser console for error messages

### Auth Not Persisting
- Ensure browser allows localStorage
- Check Firebase auth persistence settings

### Listings Not Updating
- Verify Firestore rules allow read/write
- Check browser network tab for failed requests
- Ensure user is authenticated

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Review Firebase documentation

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)

## 🗺️ Future Enhancements

- [ ] Google Maps integration for location visualization
- [ ] Real-time chat between users
- [ ] Push notifications
- [ ] User rating system
- [ ] Advanced filtering and search
- [ ] Admin dashboard
- [ ] Analytics and statistics
- [ ] Email notifications
- [ ] API documentation
- [ ] Mobile app (React Native)

---

**Built with ❤️ to fight food waste and build stronger communities.**
