# Firebase Cloud Storage Setup for Feedify

## Issue: Profile Photos Not Uploading

If profile photos are not uploading, it's likely because **Firebase Cloud Storage security rules** are not configured.

## Solution: Update Firebase Storage Rules in Firebase Console

### Steps:

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your "feedify-tn" project

2. **Navigate to Cloud Storage Rules**
   - Click "Cloud Storage" in the left menu
   - Go to the "Rules" tab (next to "Files")

3. **Replace the Default Rules**
   Copy and paste this rule set:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ===== USER PHOTOS =====
    // Authenticated users can upload their own profile photos
    match /user-photos/{userId}/{allPaths=**} {
      allow read: if true; // Anyone can view photos (public)
      allow write: if request.auth.uid == userId && 
                      request.resource.size < 5000000 && // Max 5MB
                      request.resource.contentType.matches('image/.*');
    }

    // ===== LISTING IMAGES =====
    // Users can upload images for their food listings
    match /listing-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId && 
                      request.resource.size < 10000000 && // Max 10MB
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

4. **Publish the Rules**
   - Click the "Publish" button
   - Wait for deployment to complete (30-60 seconds)

5. **Refresh Feedify**
   - Go back to your Feedify app
   - Try uploading a profile photo again
   - Should now work!

## What These Rules Do:

- ✅ Authenticated users can only upload photos to their own folder (`user-photos/{userId}`)
- ✅ Anyone can view the photos (public access)
- ✅ Restricts file size to 5MB for profile photos, 10MB for listing images
- ✅ Only allows image files (PNG, JPG, WebP, etc.)
- ✅ Prevents unauthorized deletion/modification

## Verification:

Check browser console for logs like:
- `📸 Starting photo upload to Firebase Storage...`
- `✅ Photo uploaded successfully. URL: https://...`

If you see errors like `permission-denied`, the storage rules are not published yet.
