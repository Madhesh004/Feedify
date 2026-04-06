# Feedify Claim Feature Guide

## Overview

The "Claim Food" feature allows logged-in users to claim available food listings from other users. When a user claims food, the listing status changes from "available" to "claimed", and the listing owner is notified about who claimed their food.

## How It Works

### 1. User Claims Food
- User opens a food listing they want to claim
- User clicks the "Claim Food" button (available in ListingDetailModal)
- System validates:
  - User is authenticated
  - Listing is available (not already claimed)
  - User is not the listing owner
- System shows loading state while claiming

### 2. Claim Processing
- `listingsService.claimListing()` is called with:
  - `listingId`: ID of the listing to claim
  - `userId`: ID of the user claiming
  - `claimerDetails`: User's contact info
- The listing document is updated with:
  - `status`: "claimed"
  - `claimedBy`: claimer's userId
  - `claimerName`: claimer's display name
  - `claimerEmail`: claimer's email
  - `claimerPhone`: claimer's phone
  - `claimedAt`: timestamp of the claim

### 3. Notifications Sent
- **To Listing Owner**: Notification that their food was claimed
- **To Claimer**: Confirmation that they successfully claimed the food
- Both parties get contact information to arrange pickup

### 4. Real-time Updates
- ListingsPage subscribes to listing updates
- Other users see the listing status change in real-time
- Listings disappear from "available" view once claimed

## Feature Components

### Listings Service (`src/services/listingsService.js`)

#### `claimListing(listingId, userId, claimerDetails)`
Claims a food listing for a user.

**Parameters:**
```javascript
listingId: string,          // ID of listing to claim
userId: string,             // ID of user claiming
claimerDetails: {
  name: string,             // Claimer's display name
  email: string,            // Claimer's email
  phone: string             // Claimer's phone number
}
```

**Returns:** Updated listing object with claim details

**Throws:** Error object with code and message

**Validation:**
- Listing must exist
- Listing must have status "available"
- User cannot claim their own listing

#### `unclaimListing(listingId, userId)`
Allows a claimer to unclaim a listing they claimed.

**Parameters:**
```javascript
listingId: string,          // ID of listing to unclaim
userId: string              // ID of user who claimed it
```

**Validation:**
- Listing must be claimed by this user

#### `subscribeToClaimedListings(userId, callback)`
Real-time subscription to listings claimed by a user.

**Parameters:**
```javascript
userId: string,             // ID of user who claimed food
callback: function          // Called with claimed listings array
```

**Returns:** Unsubscribe function

### Notifications Service (`src/services/notificationsService.js`)

#### `sendClaimNotification(listingId, listingTitle, listingOwnerId, claimerDetails)`
Sends notification to listing owner when food is claimed.

#### `sendClaimerNotification(listingId, listingTitle, claimerId, listingOwnerDetails)`
Sends confirmation notification to claimer.

### ListingDetailModal Component (`src/components/ListingDetailModal.jsx`)

**Props:**
```javascript
listing: object,            // Listing data
onClose: function,          // Close modal handler
onBook: function,           // Legacy pickup request handler
onClaim: function,          // Claim handler
currentUserId: string,      // Current user's ID
isOwnListing: boolean       // Whether user owns this listing
```

**Features:**
- Hidden claim button if user owns listing
- Hidden claim button if listing already claimed
- Shows claiming status with loading indicator
- Displays claim information if listing is claimed
- Shows error messages if claim fails

### ListingsPage (`src/pages/ListingsPage.jsx`)

**`handleClaim(listing)`:**
- Validates user owns up-to-date profile
- Gets user profile for claim details
- Calls listingsService.claimListing()
- Handles success/error messages
- Updates UI in real-time

## Data Flow

```
User Views Listing
    ↓
Clicks "Claim Food" Button
    ↓
ListingDetailModal.onClaim called
    ↓
ListingsPage.handleClaim()
    ├─ Get user profile from Firestore
    └─ Call listingsService.claimListing()
        ├─ Validate listing is available
        ├─ Update listing document
        ├─ Send notification to owner
        └─ Send confirmation to claimer
    ↓
Real-time subscription updates
all connected users' listing views
    ↓
Show success toast message
Close modal
```

## Firestore Updates

### Listing Document Changes

**Before Claim:**
```javascript
{
  status: "available",
  claimedBy: null,
  claimerName: null,
  claimerEmail: null,
  claimerPhone: null,
  claimedAt: null
}
```

**After Claim:**
```javascript
{
  status: "claimed",
  claimedBy: "user456def",
  claimerName: "Jane Smith",
  claimerEmail: "jane@example.com",
  claimerPhone: "+1987654321",
  claimedAt: Timestamp (Mar 15, 2024, 11:30am)
}
```

### Notifications Created

**For Owner:**
- Type: `"food_claimed"`
- Contains claimer's contact information
- Timestamp of when claim occurred

**For Claimer:**
- Type: `"claim_confirmed"`
- Contains owner's contact information
- Listing title and details

## Security

### Firestore Security Rules
- Only authenticated users can claim listings
- Users can only unclaim listings they themselves claimed
- Listing owner cannot claim their own listing (app-level validation)

### App-Level Validation
```javascript
// User must be authenticated
if (!auth.currentUser) {
  throw error("Please login first");
}

// Cannot claim own listing
if (listing.userId === user.uid) {
  throw error("You cannot claim your own listing");
}

// Cannot claim already claimed listing
if (listing.status === "claimed") {
  throw error("This listing has already been claimed");
}
```

## User Experience

### Success Flow
1. User sees "Claim Food" button in modal
2. Clicks button → button shows "Claiming..." with spinner
3. Claim succeeds → toast shows "🎉 You've successfully claimed this food!"
4. Modal closes
5. Listing disappears from available listings
6. User receives notification with owner's contact info

### Error Flows

**User Not Authenticated:**
- Toast: "Please login first"
- Modal remains open

**User Tries to Claim Own Listing:**
- Toast: "You cannot claim your own listing"
- Modal remains open

**Listing Already Claimed:**
- Toast: "This listing has already been claimed"
- Modal remains open

**Network Error:**
- Toast: Error message from Firestore
- Modal remains open with button still clickable

## Testing the Feature

### Prerequisites
- User 1: Has authenticated and created a listing
- User 2: Has authenticated  
- Firestore security rules deployed

### Test Steps

1. **Login as User 1**
   - Create a food listing
   - Verify it appears as "Available"

2. **Logout and Login as User 2**
   - Navigate to Listings page
   - Find User 1's listing
   - Click "View Details"
   - Click "Claim Food"

3. **Verify Claim Success**
   - Modal shows "Already Claimed" alert
   - Listing shows claimed status
   - Listing disappears from "available" filters

4. **Check Notifications**
   - User 1 should see notification about User 2 claiming the food
   - Notification contains User 2's contact info
   - User 2 should see confirmation notification

5. **Test Unclaim**
   - User 2 can click claim button again to unclaim (if feature enabled)
   - Listing goes back to "available"
   - Notifications updated

## API Reference

### Services

#### `listingsService.claimListing()`
```javascript
const result = await listingsService.claimListing(
  listingId,
  userId,
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321"
  }
);
// Returns updated listing object
```

#### `listingsService.subscribeToClaimedListings()`
```javascript
const unsubscribe = listingsService.subscribeToClaimedListings(
  userId,
  (claimedListings) => {
    console.log("Claimed listings:", claimedListings);
  }
);

// Later: unsubscribe();
```

### React Hooks

#### In Page Components
```javascript
const handleClaim = async (listing) => {
  try {
    // Validate user owns profile
    const userProfile = await userService.getUserProfile(user.uid);
    
    // Claim the listing
    const claimDetails = {
      name: user.displayName,
      email: user.email,
      phone: userProfile?.phone
    };
    
    await listingsService.claimListing(
      listing.id,
      user.uid,
      claimDetails
    );
    
    toast.success("Food claimed successfully!");
  } catch (error) {
    toast.error(error.message);
  }
};
```

## Future Enhancements

1. **Review & Rating**: Rate users after claiming food
2. **Track History**: See all claimed food with dates
3. **Unclaim Permission**: Allow owner to unclaim and take back
4. **Bulk Claim**: Claim multiple items at once
5. **Claim Analytics**: Dashboard showing claim history
6. **Claim Expiry**: Auto-unclaim if not picked up by deadline
7. **Claim Confirmation**: Require both parties to confirm pickup

## Troubleshooting

### Claim Button Not Appearing
- **Cause**: User owns the listing
- **Solution**: Only show button for other users' listings

### "Permission Denied" Error
- **Cause**: Security rules not deployed or too restrictive
- **Solution**: Check FIRESTORE_SECURITY_RULES.md and redeploy

### Claim Not Showing Up
- **Cause**: Subscription not updating
- **Solution**: Check browser console for Firestore errors

### Contact Info Not Showing
- **Cause**: User profile not complete
- **Solution**: Ensure user completed profile before claiming

## Related Documentation
- [Firestore Schema](./FIRESTORE_SCHEMA.md)
- [Security Rules](./FIRESTORE_SECURITY_RULES.md)
- [API Reference](./API_REFERENCE.md)
