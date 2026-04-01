# Setup Instructions for Feedify

## Quick Start Guide

### Step 1: Firebase Setup (Essential)

1. Go to https://console.firebase.google.com
2. Create a new project named "Feedify"
3. In your project:
   - **Authentication**: Enable Email/Password
   - **Firestore**: Create database in test mode
   - **Storage**: Create a storage bucket

4. Get your config from Project Settings → Your apps → Web
5. Copy to .env file

### Step 2: Install & Run

```bash
npm install
npm run dev
```

### Step 3: First Time Setup

1. Visit http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Create an account
4. Try creating a food listing
5. View all listings
6. Check your dashboard

## Development Workflow

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint
```

## Key Components Overview

### Authentication Flow
1. User signs up/logs in → Firebase Auth
2. JWT token stored automatically
3. User data stored in Zustand store
4. Protected routes check authentication status

### Real-Time Listings
1. User creates listing → Saved to Firestore
2. Real-time listener subscribes to updates
3. All users see new listings instantly
4. Zustand store keeps data in sync

### Form Validation
1. React Hook Form captures input
2. Zod schema validates on submit
3. Error messages displayed inline
4. Toast notifications confirm success/error

## Next Steps for Production

1. **Update Firebase Rules** (use firebase-rules.txt)
2. **Add Google Maps API** (in .env)
3. **Setup CI/CD** (GitHub Actions, etc.)
4. **Deploy to Firebase Hosting**
5. **Monitor with Firebase Console**

## Testing the Features

### Test Signup/Login
- Signup → Create new account
- Logout → Clear session
- Login → Restore session

### Test Real-Time
- Open app in two windows
- Create listing in one
- See instant update in other

### Test Filters
- Create multiple listings
- Filter by food type
- Test search functionality

### Test Dashboard
- Navigate to Dashboard
- See your listings
- Delete a listing (should reflect instantly)

## Debugging Tips

1. **Check Console** - Look for error messages
2. **Firebase Console** - Check Firestore data
3. **Network Tab** - Verify API calls
4. **React DevTools** - Inspect component state
5. **Local Storage** - Check auth persistence

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Firebase config not found" | Check .env file has all fields |
| "Auth not working" | Enable Email/Password in Firebase Console |
| "Listings not loading" | Check Firestore is created and rules are updated |
| "Images not uploading" | Verify Storage bucket exists and rules allow uploads |
| "Slow performance" | Check Firestore indexes and optimize queries |

## Architecture Decisions

1. **Firebase** - Real-time sync without backend maintenance
2. **Zustand** - Simpler state management than Redux
3. **React Router** - Standard routing solution
4. **Tailwind** - Utility-first CSS for rapid development
5. **Firestore** - NoSQL for flexible data structure

## File Structure Best Practices

- **Components**: Reusable UI components only
- **Pages**: Full page components with routing
- **Services**: API calls and data operations
- **Store**: Global state (Zustand)
- **Utils**: Helper functions
- **Hooks**: Custom React hooks
- **Config**: Configuration files

## Next Phase Enhancements

After successful deploy, consider:
1. Add Google Maps integration
2. Implement chat system (Socket.IO)
3. Add push notifications
4. Create admin panel
5. Setup analytics
6. Add email notifications
7. Implement rating system

## Support Resources

- Firebase Docs: https://firebase.google.com/docs
- React Docs: https://react.dev
- Tailwind: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
