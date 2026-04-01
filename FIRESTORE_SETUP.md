# Firestore Security Rules Setup for Feedify

## Problem
If your listing creation is failing with "Creating Listing..." stuck on the button, it's likely due to Firestore security rules denying write access.

## Solution: Update Firestore Rules in Firebase Console

### Steps:

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your "feedify-tn" project

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in the left menu
   - Go to the "Rules" tab

3. **Replace the Default Rules**
   Copy and paste this rule set:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ===== LISTINGS COLLECTION =====
    // Anyone can read listings (for browsing)
    // Only authenticated users can create listings
    // Only the owner can update/delete
    match /listings/{listing} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // ===== USERS COLLECTION =====
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // ===== MESSAGES COLLECTION (FOR CHAT) =====
    // Only authenticated users can access messages
    match /messages/{message} {
      allow read, write: if request.auth != null;
    }

    // ===== RATINGS COLLECTION =====
    match /ratings/{rating} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

4. **Publish the Rules**
   - Click the "Publish" button
   - Wait for the deployment to complete (usually 30-60 seconds)

5. **Test It**
   - Go back to your Feedify app
   - Refresh the page (or the dev server should hot-reload)
   - Try creating a listing again

## Verification

You should see these in the browser console:
- `🔥 [createListing] Starting listing creation`
- `✅ [createListing] Success! Listing created with ID: <document-id>`

If you still see errors, check:
1. Are you logged in? (Check header for your name)
2. Is your browser console showing any error messages?
3. Did you publish the rules successfully?

## Extra: Test Rules

You can test the rules without making actual changes:
1. In the Rules editor, click "Rules Playground"
2. Test creating a document with/without authentication
3. Verify the rules work as expected
