# Feedify Feature Testing Guide

## Complete Testing Checklist

This guide provides step-by-step instructions to test all Feedify features, including the Claim Food functionality.

## Prerequisites

- ✅ Firebase project created and configured
- ✅ `.env.local` file with Firebase credentials
- ✅ Firestore security rules deployed
- ✅ Development server running (`npm run dev`)
- ✅ Browser DevTools open to check console

## Test Accounts

Create 2 test user accounts:

**User 1: Lister**
- Email: `lister@test.com`
- Password: `Test@123456`
- Display Name: "Chef Alice"

**User 2: Claimer**
- Email: `claimer@test.com`
- Password: `Test@456789`
- Display Name: "John Finder"

## Test Scenarios

### Scenario 1: User Registration & Authentication

#### Test Case 1.1: Email/Password Signup
```
Steps:
1. Open http://localhost:5173/signup
2. Fill in:
   - Display Name: "Chef Alice"
   - Email: lister@test.com
   - Password: Test@123456
   - Confirm Password: Test@123456
3. Click "Sign Up"

Expected Result:
✓ User account created
✓ Redirected to /listings page
✓ User is logged in
✓ Display name shows in header
✓ User document created in Firestore users collection
```

#### Test Case 1.2: Email/Password Login
```
Steps:
1. Go to /login
2. Fill in:
   - Email: lister@test.com
   - Password: Test@123456
3. Click "Sign In"

Expected Result:
✓ Successfully logged in
✓ Redirected to /listings
✓ User profile loaded
✓ No auth errors in console
```

#### Test Case 1.3: Google Sign-In (Optional)
```
Steps:
1. Click "Continue with Google" button
2. Select test Google account
3. Grant permissions

Expected Result:
✓ Successfully authenticated
✓ User profile created in Firestore
✓ Redirected to /listings
```

---

### Scenario 2: Create Food Listing

#### Test Case 2.1: Create Valid Listing
```
Steps:
1. As Chef Alice, click "List Food" in navigation
2. Go to /list-food page
3. Fill in form:
   - Title: "Homemade Pizza Slices"
   - Description: "Fresh pizza made today with vegetables. Perfect for dinner or lunch. 4 large slices available."
   - Quantity: "4 slices"
   - Food Type: "Cooked Food"
   - Pickup Time: "Today 6-8pm"
   - Contact Info: "+1-555-0123"
   - Location: "123 Main St, San Francisco, CA"
4. Click "Get Location" to capture GPS coordinates
5. Click "Create Listing"

Expected Result:
✓ GPS coordinates captured (shown in browser)
✓ Listing created successfully
✓ Toast: "Food listing created successfully!"
✓ Redirected to /listings page
✓ New listing appears in the list
✓ Listing shows as "Available"
✓ Document created in Firestore listings collection
```

#### Test Case 2.2: Create Listing with Image
```
Steps:
1. In list-food form, drag and drop an image or click to upload
2. Fill rest of form
3. Submit

Expected Result:
✓ Image preview shows
✓ Image is included when listing created
✓ Image URL stored in Firestore
✓ Image displays on listing card
```

#### Test Case 2.3: Validation Errors
```
Steps:
1. Try to submit form with:
   - Empty title
   - Description under 10 chars
   - Missing required fields

Expected Result:
✓ Form shows error messages
✓ Submit disabled until fixed
✓ No API call made
✓ Form errors match Zod schema
```

---

### Scenario 3: View & Browse Listings

#### Test Case 3.1: View All Listings
```
Steps:
1. Navigate to /listings page
2. Observe listings grid

Expected Result:
✓ All available listings displayed
✓ Listings show:
  - Food image
  - Title
  - Description (truncated)
  - Quantity
  - Location
  - Time posted
  - Host name
  - Status badge (Available/Collected)
✓ Listings ordered by newest first
```

#### Test Case 3.2: Search Listings
```
Steps:
1. In search bar, type "Pizza"
2. Observe results

Expected Result:
✓ Only listings with "pizza" in title/description shown
✓ Search is case-insensitive
✓ Real-time filtering
✓ Results update as you type
```

#### Test Case 3.3: Filter by Food Type
```
Steps:
1. Select "Cooked Food" in Food Type filter
2. Observe results
3. Try other food types

Expected Result:
✓ Only selected type shown
✓ Count updates
✓ Multiple filters work together
```

#### Test Case 3.4: Filter by Status
```
Steps:
1. Select "Available" status
2. Select "Collected" status
3. Select "All"

Expected Result:
✓ Listings filtered by status
✓ Only matching status shown
✓ "All" shows everything
```

---

### Scenario 4: View Listing Details

#### Test Case 4.1: Open Listing Modal
```
Steps:
1. On listings page, click "View Details" on any listing
2. Modal opens

Expected Result:
✓ Modal displays full listing details:
  - Large image
  - Title
  - Description
  - All details in grid
  - Location section with coordinates
  - Host info
✓ Modal can scroll if content tall
```

#### Test Case 4.2: Close Modal
```
Steps:
1. With modal open, click X button or "Close"
2. Or click outside modal

Expected Result:
✓ Modal closes
✓ Listing remains selected in store (if needed)
✓ Scrolling works on page again
```

---

### Scenario 5: Claim Food Feature ⭐

#### Test Case 5.1: Claim Available Listing
```
Steps:
1. As Chef Alice, log out: /logout
2. Log in as John Finder (claimer@test.com)
3. Go to /listings
4. Find Chef Alice's pizza listing
5. Click "View Details"
6. Verify "Claim Food" button visible
7. Click "Claim Food"

Expected Result:
✓ Button shows "Claiming..." with spinner
✓ No errors in console
✓ After 1-2 seconds:
  - Button changes to success state
  - Toast: "🎉 You've successfully claimed this food!"
  - Modal closes
✓ Listing now shows:
  - Status: "Claimed"
  - Claim info displayed
✓ Listing disappears from available listings view
```

#### Test Case 5.2: Can't Claim Own Listing
```
Steps:
1. Log in as Chef Alice
2. Go to /listings
3. Open her own pizza listing
4. Observe claim button

Expected Result:
✓ "Claim Food" button NOT visible
✓ Only "Request Pickup" or "Close" buttons shown
✓ No claim UI elements present
```

#### Test Case 5.3: Can't Claim Already Claimed Listing
```
Steps:
1. Create new test user 3
2. Log in as user 3
3. Try to find already-claimed listing
4. Try to claim it

Expected Result:
✓ "Already Claimed" alert shows in modal
✓ Toast: "This listing has already been claimed"
✓ Claim button disabled
```

#### Test Case 5.4: Real-Time Claim Updates
```
Steps:
1. On Computer A: Log in as Chef Alice
2. On Computer B (or incognito): Log in as John Finder
3. Both open same listing
4. On Computer B: Claim the listing
5. Watch Computer A

Expected Result:
✓ Immediately on Computer A:
  - Listing status changes to "Claimed"
  - Claim info appears
  - Listing disappears from list if filtered by "available"
```

#### Test Case 5.5: Claim Details Accuracy
```
Steps:
1. As John Finder, claim a listing
2. Go to Firestore console
3. Open claimed listing document
4. Check claim fields

Expected Result:
✓ Firestore shows:
  - status: "claimed"
  - claimedBy: John's UID
  - claimerName: "John Finder"
  - claimerEmail: "claimer@test.com"
  - claimerPhone: (from profile)
  - claimedAt: timestamp
  - updatedAt: current timestamp
```

---

### Scenario 6: Notifications

#### Test Case 6.1: Owner Receives Claim Notification
```
Steps:
1. As Chef Alice, navigate to notifications (if available)
2. Watch for notification after John claims pizza

Expected Result:
✓ New notification appears
✓ Title: "Your food has been claimed!"
✓ Contains:
  - John's name
  - Listing title
  - John's phone number
  - "Claim confirmed" message
```

#### Test Case 6.2: Claimer Receives Confirmation
```
Steps:
1. As John Finder, check notifications
2. Look for claim confirmation

Expected Result:
✓ Notification shows
✓ Title: "Successfully claimed..."
✓ Contains:
  - Chef Alice's contact info
  - Listing title
  - "Contact owner to arrange pickup"
```

---

### Scenario 7: Bookmark Features

#### Test Case 7.1: Bookmark Listing
```
Steps:
1. On listing card, click heart icon
2. Verify it changes color/style

Expected Result:
✓ Heart turns red/filled
✓ Listing added to bookmarks
✓ Update persisted to Firestore
```

#### Test Case 7.2: Unbookmark Listing
```
Steps:
1. On bookmarked listing, click heart again

Expected Result:
✓ Heart returns to outline
✓ Listing removed from bookmarks
✓ Change persisted
```

---

### Scenario 8: User Profile

#### Test Case 8.1: View Profile
```
Steps:
1. Click profile icon in header
2. Go to /profile

Expected Result:
✓ User profile page displays
✓ Shows:
  - Display name
  - Email
  - Phone (if set)
  - Location (if set)
  - Edit options
```

#### Test Case 8.2: Update Profile
```
Steps:
1. Click "Edit Profile"
2. Update:
   - Phone: "+1-555-9999"
   - Location: "San Jose, CA"
   - Bio: "Loves sharing food"
3. Save

Expected Result:
✓ Profile updated
✓ Changes saved to Firestore
✓ Toast: "Profile updated"
✓ Header shows updated info
```

---

### Scenario 9: Error Handling

#### Test Case 9.1: Network Error During Claim
```
Steps:
1. Open DevTools Network tab
2. Toggle "Offline" mode
3. Try to claim listing
4. Go back online

Expected Result:
✓ Error message shown: "Failed to claim listing"
✓ Modal stays open
✓ User can retry
✓ Works once back online
```

#### Test Case 9.2: Unauthorized Modification
```
Steps:
1. In browser console, manually try to update another user's listing
2. Call updateListing with someone else's listing

Expected Result:
✓ Firestore rejects with "permission-denied"
✓ Console shows error
✓ No changes made to listing
```

---

### Scenario 10: End-to-End Flow

#### Complete Journey Test
```
Steps:
PART 1 - Create User & Listing:
1. Sign up as new user "TestLister"
2. Create food listing:
   - Title: "Fresh Salad"
   - Good description
   - Set location
   - Set contact info
3. Verify listing appears in /listings

PART 2 - View as Different User:
4. Logout
5. Sign up as "TestFinder"
6. Go to /listings
7. Search for "Fresh Salad"
8. Click "View Details"

PART 3 - Claim Food:
9. Click "Claim Food"
10. Verify success toast
11. Verify listing shows "Claimed"
12. Log out

PART 3 - Owner Verification:
13. Log back in as TestLister
14. Check that listing shows as claimed
15. See TestFinder's contact info

Expected Result:
✓ All steps complete without errors
✓ Data consistent across views
✓ Real-time updates work
✓ Notifications sent
✓ No console errors
✓ Firestore has correct data
```

---

## Performance Testing

### Test Case P1: Load Multiple Listings
```
Steps:
1. Create 20+ food listings
2. Open /listings
3. Observe load time and responsiveness

Expected Result:
✓ Listings load within 2 seconds
✓ Scrolling smooth
✓ No memory leaks in DevTools
✓ Pagination/virtualization works if implemented
```

### Test Case P2: Real-time Updates Performance
```
Steps:
1. Have 3 browser windows open on /listings
2. In one window, create new listing
3. Monitor other windows for update speed

Expected Result:
✓ Updates appear within 1 second
✓ No duplicate listings
✓ No UI freezing
✓ Smooth animations
```

---

## Security Testing

### Test Case S1: Authentication Required
```
Steps:
1. Open DevTools
2. Clear localStorage
3. Try to access /list-food directly

Expected Result:
✓ Redirected to /login
✓ Cannot access protected routes
✓ Cannot view user data
```

### Test Case S2: Security Rules
```
Steps:
1. In Firestore console
2. Try to manually create document in "users" collection
3. Try to delete another user's listing
4. Try to read with custom query

Expected Result:
✓ Operations blocked by security rules
✓ Permission denied errors
✓ Only allowed operations succeed
```

---

## Browser Compatibility

Test on:
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers

---

## Test Report Template

```markdown
## Test Results - [Date]

### Environment
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Server: [http://localhost:5173]

### Tests Passed: X/Y

### Issues Found
1. [Issue]: [Description]
   - Expected: [what should happen]
   - Actual: [what happened]
   - Steps to reproduce: [...]
   - Severity: [Critical/High/Medium/Low]

### Performance Metrics
- Average Load Time: [X seconds]
- Real-time Update Delay: [X ms]
- Memory Usage: [X MB]

### Approved for Release: [Yes/No]
```

---

## Checklist for Release

- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Security rules tested
- [ ] Real-time updates working
- [ ] Claim feature complete
- [ ] Notifications working
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Error handling tested
- [ ] Documentation complete

---

## Common Test Issues & Solutions

### Issue: Listing not appearing after creation
**Solution**: 
- Check Firestore has document
- Refresh page
- Check browser console for errors
- Verify subscribeToListings is active

### Issue: Claim button not showing
**Solution**:
- Verify you're not logged in as the owner
- Check listing status is "available"
- Refresh page

### Issue: Real-time updates not working
**Solution**:
- Check Firestore rules allow read access
- Verify onSnapshot listener active
- Check network in DevTools
- Ensure subscription not unsubscribed

### Issue: Authentication not persisting
**Solution**:
- Check localStorage enabled
- Check browser privacy settings
- Verify persistence rules correct
- Check console for auth errors

---

**Last Updated**: April 5, 2026
**Version**: 1.0.0
