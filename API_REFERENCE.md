# Feedify API Reference

## Table of Contents
1. [Authentication Service](#authentication-service)
2. [Listings Service](#listings-service)
3. [Chat Service](#chat-service)
4. [User Service](#user-service)
5. [Maps Service](#maps-service)
6. [Notification Service](#notification-service)
7. [Custom Hooks](#custom-hooks)

---

## Authentication Service

**Location:** `src/services/authService.js`

### signup(email, password, displayName)
Create a new user account.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password (min 6 chars)
- `displayName` (string): User's display name

**Returns:** Promise<{uid, email, displayName}>

**Example:**
```javascript
try {
  const user = await authService.signup(
    "user@example.com",
    "password123",
    "John Doe"
  );
  console.log("Signed up:", user.uid);
} catch (error) {
  console.error("Signup failed:", error.message);
}
```

---

### signin(email, password)
Log in an existing user.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Returns:** Promise<{uid, email, displayName}>

**Example:**
```javascript
try {
  const user = await authService.signin(
    "user@example.com",
    "password123"
  );
  console.log("Logged in:", user.displayName);
} catch (error) {
  if (error.code === "auth/user-not-found") {
    console.error("User not found");
  }
}
```

---

### logout()
Log out the current user.

**Parameters:** None

**Returns:** Promise<void>

**Example:**
```javascript
try {
  await authService.logout();
  console.log("Logged out successfully");
} catch (error) {
  console.error("Logout failed:", error);
}
```

---

### onAuthStateChange(callback)
Listen for auth state changes.

**Parameters:**
- `callback` (function): Called with user object or null

**Returns:** Unsubscribe function

**Example:**
```javascript
const unsubscribe = authService.onAuthStateChange((user) => {
  if (user) {
    console.log("User logged in:", user.displayName);
  } else {
    console.log("User logged out");
  }
});

// To stop listening:
unsubscribe();
```

---

### getCurrentUser()
Get the currently authenticated user.

**Parameters:** None

**Returns:** Firebase User object or null

**Example:**
```javascript
const user = authService.getCurrentUser();
if (user) {
  console.log("Current user email:", user.email);
}
```

---

## Listings Service

**Location:** `src/services/listingsService.js`

### createListing(data, userId)
Create a new food listing.

**Parameters:**
- `data` (object): Listing details
- `userId` (string): Owner's user ID

**Returns:** Promise<{id, ...data}>

**Listing Data Object:**
```javascript
{
  title: "Fresh Vegetables",
  description: "Assorted fresh vegetables from my garden",
  foodType: "fresh",
  quantity: "5 kg",
  expiryTime: "2024-04-15T18:00:00",
  pickupTime: "15:00",
  contactInfo: "9876543210",
  location: "123 Main Street, City",
  images: ["base64string or URL"],
  coordinates: { latitude: 40.7128, longitude: -74.006 }
}
```

**Example:**
```javascript
const listing = await listingsService.createListing({
  title: "Fresh Vegetables",
  description: "Organic vegetables",
  foodType: "fresh",
  quantity: "5 kg",
  pickupTime: "15:00",
  contactInfo: "9876543210",
  location: "123 Main St",
  coordinates: { latitude: 40.7128, longitude: -74.006 }
}, userId);
```

---

### subscribeToListings(callback)
Subscribe to real-time updates of all available listings.

**Parameters:**
- `callback` (function): Called with listings array

**Returns:** Unsubscribe function

**Example:**
```javascript
const unsubscribe = listingsService.subscribeToListings((listings) => {
  console.log("Updated listings:", listings.length);
});

// Later, to stop listening:
unsubscribe();
```

---

### subscribeToUserListings(userId, callback)
Subscribe to a specific user's listings.

**Parameters:**
- `userId` (string): User's ID
- `callback` (function): Called with user's listings array

**Returns:** Unsubscribe function

**Example:**
```javascript
const unsubscribe = listingsService.subscribeToUserListings(
  userId,
  (listings) => {
    console.log("My listings:", listings);
  }
);
```

---

### updateListing(listingId, data)
Update an existing listing.

**Parameters:**
- `listingId` (string): Listing ID
- `data` (object): Fields to update

**Returns:** Promise<void>

**Example:**
```javascript
await listingsService.updateListing(listingId, {
  status: "collected",
  quantity: "3 kg"
});
```

---

### deleteListing(listingId)
Delete a listing.

**Parameters:**
- `listingId` (string): Listing ID

**Returns:** Promise<void>

**Example:**
```javascript
await listingsService.deleteListing(listingId);
```

---

## Chat Service

**Location:** `src/services/chatService.js`

### sendMessage(conversationId, senderId, recipientId, message)
Send a message to another user.

**Parameters:**
- `conversationId` (string): Unique conversation ID
- `senderId` (string): Sender's user ID
- `recipientId` (string): Recipient's user ID
- `message` (string): Message content

**Returns:** Promise<{id, conversationId, senderId, ...}>

**Example:**
```javascript
const msg = await chatService.sendMessage(
  "user1_user2",
  currentUserId,
  recipientUserId,
  "Hi, is this still available?"
);
```

---

### subscribeToMessages(conversationId, callback)
Listen for messages in a conversation (real-time).

**Parameters:**
- `conversationId` (string): Conversation ID
- `callback` (function): Called with messages array

**Returns:** Unsubscribe function

**Example:**
```javascript
const unsubscribe = chatService.subscribeToMessages(
  conversationId,
  (messages) => {
    console.log("Messages:", messages);
  }
);
```

---

### subscribeToConversations(userId, callback)
Get user's active conversations.

**Parameters:**
- `userId` (string): User's ID
- `callback` (function): Called with conversations array

**Returns:** Unsubscribe function

---

## User Service

**Location:** `src/services/userService.js`

### createUserProfile(userId, profileData)
Create or update user profile.

**Parameters:**
- `userId` (string): User's ID
- `profileData` (object): Profile information

**Example:**
```javascript
await userService.createUserProfile(userId, {
  displayName: "John Doe",
  avatar: "url",
  bio: "Food enthusiast"
});
```

---

### getUserProfile(userId)
Get user profile data.

**Parameters:**
- `userId` (string): User's ID

**Returns:** Promise<profileObject>

---

### rateUser(raterId, ratedUserId, rating, review)
Add or update a rating for a user.

**Parameters:**
- `raterId` (string): Who is rating
- `ratedUserId` (string): Who is being rated
- `rating` (number): 1-5 stars
- `review` (string): Review text

**Returns:** Promise<void>

---

### getUserRating(userId)
Get a user's average rating.

**Parameters:**
- `userId` (string): User's ID

**Returns:** Promise<{average: number, count: number}>

---

## Maps Service

**Location:** `src/services/mapsService.js`

### loadScript(apiKey)
Load Google Maps API script.

**Parameters:**
- `apiKey` (string): Google Maps API key

**Returns:** Promise<void>

**Example:**
```javascript
await mapsService.loadScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

---

### initMap(containerElement, options)
Initialize a Google Map.

**Parameters:**
- `containerElement` (HTMLElement): Container div
- `options` (object): Map options (zoom, center, etc.)

**Returns:** Google Map instance

---

### addMarker(map, position, options)
Add a marker to the map.

**Parameters:**
- `map` (MapInstance): Google Map
- `position` (object): {latitude, longitude}
- `options` (object): Marker options

**Returns:** Marker instance

---

### geocode(address)
Convert address to coordinates.

**Parameters:**
- `address` (string): Physical address

**Returns:** Promise<{latitude, longitude, address}>

---

### reverseGeocode(lat, lng)
Convert coordinates to address.

**Parameters:**
- `lat` (number): Latitude
- `lng` (number): Longitude

**Returns:** Promise<{address, components}>

---

### calculateDistance(point1, point2)
Calculate distance between two points.

**Parameters:**
- `point1` (object): {latitude, longitude}
- `point2` (object): {latitude, longitude}

**Returns:** Promise<{distance, duration, ...}>

---

## Notification Service

**Location:** `src/services/notificationService.js`

### success(message, options)
Show success notification.

**Example:**
```javascript
notificationService.success("Listing created successfully!");
```

---

### error(message, options)
Show error notification.

**Example:**
```javascript
notificationService.error("Failed to create listing");
```

---

### browserNotification(title, options)
Show browser native notification.

**Example:**
```javascript
await notificationService.browserNotification("New message", {
  body: "You have a new message from John"
});
```

---

## Custom Hooks

**Location:** `src/hooks/index.js`

### useGeolocation()
Get user's current location.

**Returns:** {location, error, loading, getLocation}

**Example:**
```javascript
const { location, getLocation, loading } = useGeolocation();

// Call to get location
getLocation();

// Use location
if (location) {
  console.log(location.latitude, location.longitude);
}
```

---

### useDebounce(value, delay)
Debounce a value.

**Parameters:**
- `value` (any): Value to debounce
- `delay` (number): Debounce delay in ms (default 500)

**Returns:** Debounced value

**Example:**
```javascript
const searchTerm = useDebounce(inputValue, 500);

useEffect(() => {
  // This runs only after user stops typing for 500ms
  search(searchTerm);
}, [searchTerm]);
```

---

### useLocalStorage(key, initialValue)
Persist and retrieve data from localStorage.

**Parameters:**
- `key` (string): Storage key
- `initialValue` (any): Default value

**Returns:** [value, setValue]

**Example:**
```javascript
const [theme, setTheme] = useLocalStorage("theme", "light");
```

---

### usePrevious(value)
Get the previous value of a variable.

**Parameters:**
- `value` (any): Current value

**Returns:** Previous value

**Example:**
```javascript
const previousCount = usePrevious(count);
```

---

## Error Handling

All services throw errors in this format:

```javascript
{
  code: "error-code",
  message: "Human readable message"
}
```

**Example:**
```javascript
try {
  await listingsService.createListing(data, userId);
} catch (error) {
  if (error.code === "permission-denied") {
    // User doesn't have permission
  } else {
    // Unknown error
    console.error(error.message);
  }
}
```

---

## Rate Limiting

Firebase automatically handles rate limiting. You can:

1. Monitor in Firebase Console
2. Set custom rules
3. Implement client-side throttling if needed

---

## Best Practices

1. **Always unsubscribe** from listeners
2. **Batch updates** when possible
3. **Validate input** before API calls
4. **Handle errors** gracefully
5. **Use debouncing** for frequent updates
6. **Cache results** when possible
7. **Optimize queries** with indexes

---

**Last Updated:** April 2026
**SDK Version:** 10.11.0
