# Feedify Firebase Configuration - Complete Setup Guide

## Issue 1: Firestore Index Error

### Error Message:
```
❌ Error subscribing to listings: FirebaseError: The query requires an index
```

### Solution:

**Option A: Auto-Create Index (Easiest)**
1. Click the link from the error message in console
2. It will take you to Firebase Console with index pre-configured
3. Click "Create Index" button
4. Wait for deployment (2-3 minutes)

**Option B: Manual Index Creation**
1. Go to **Firebase Console** → **Feedify** project
2. Click **Firestore Database** → **Indexes** tab
3. Click **Create Index**
4. Fill in:
   - **Collection ID**: `listings`
   - **Fields**: 
     - `status` (Ascending)
     - `createdAt` (Descending)
5. Click **Create Index**
6. Wait for deployment ✅

---

## Issue 2: Cloud Storage CORS Error

### Error Message:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
has been blocked by CORS policy
```

### Solution:

1. Go to **Firebase Console** → **Cloud Storage** → **Rules** tab
2. **Replace ALL existing rules** with this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files (public)
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // User photos - authenticated users only
    match /user-photos/{userId}/{allPaths=**} {
      allow write: if request.auth.uid == userId && 
                      request.resource.size < 5000000 && // Max 5MB
                      request.resource.contentType.matches('image/.*');
    }

    // Listing images - authenticated users only
    match /listing-images/{userId}/{allPaths=**} {
      allow write: if request.auth.uid == userId && 
                      request.resource.size < 10000000 && // Max 10MB
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click **Publish**
4. Wait for deployment (30-60 seconds) ✅
5. Refresh Feedify app

---

## Verification Checklist:

After following both fixes:

- [ ] Firestore index is deployed (shows "Enabled" in Indexes tab)
- [ ] Cloud Storage rules are published (shows success message)
- [ ] Browser console is clear of errors
- [ ] Can upload profile photo without CORS errors
- [ ] Can view food listings without index errors

---

## Quick Links:

- **Firestore Indexes**: https://console.firebase.google.com/project/feedify-tn/firestore/indexes
- **Cloud Storage Rules**: https://console.firebase.google.com/project/feedify-tn/storage/rules
- **Firestore Rules**: https://console.firebase.google.com/project/feedify-tn/firestore/rules

---

## If You Still See Errors:

1. **Hard refresh** Feedify (Cmd+Shift+R on Mac)
2. Check Console (F12) for new error messages
3. Verify both rules and index are showing as "Active/Enabled" in Firebase Console
4. Clear browser cache if needed

