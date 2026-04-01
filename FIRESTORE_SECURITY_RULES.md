# Firestore Security Rules Setup

## Overview
This file contains the security rules needed for Feedify to work properly.

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **feedify-tn** project
3. Click **Firestore Database** → **Rules** tab
4. Replace all content with the rules below
5. Click **Publish**

## Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - allow users to read and write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listings collection - allow public read, authenticated write
    match /listings/{listingId} {
      allow read: if true; // Public listings
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        request.auth.uid == resource.data.senderId
      );
      allow create: if request.auth != null;
    }
    
    // Messages collection for chat
    match /messages/{messageId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.senderId || 
        request.auth.uid == resource.data.receiverId
      );
      allow create: if request.auth != null;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## What These Rules Do

- **Users**: Can read any user profile, but can only write to their own
- **Listings**: Public read access, authenticated users can create, only creator can edit
- **Notifications**: Users can read/write notifications sent to or from them
- **Messages**: Users can read/write messages they're part of
- **Default**: All other access denied

## Testing the Rules

After publishing:
1. Go to Feedify app
2. Log in
3. Update your profile - should now save without hanging
4. Create a new listing - should work
5. Check browser console (F12) for any Firestore errors

## Troubleshooting

If you still get errors:
- Clear browser cache (Cmd+Shift+Del)
- Refresh the page (Cmd+R)
- Check browser console for specific Firestore error messages
- Verify rules were saved by refreshing Firebase Console
