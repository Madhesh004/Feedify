# Customization & Extension Guide

## How to Customize Feedify

This guide shows how to extend and customize Feedify for your specific needs.

---

## 🎨 UI Customization

### Colors & Branding

**Change Primary Color:**

1. **Tailwind Configuration** - Update `tailwind.config.js`:
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          600: '#16a34a', // Change to your brand color
          700: '#15803d',
        }
      }
    }
  }
}
```

2. **Update Component Usage:**
```jsx
// Before
className="bg-emerald-600"

// After
className="bg-primary-600"
```

3. **CSS Variables Alternative:**
```css
:root {
  --primary: #16a34a;
  --primary-dark: #15803d;
}
```

### Fonts

**Add Custom Font:**

1. **In `src/index.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400,600,700&display=swap');

@layer base {
  body {
    @apply font-sans;
    font-family: 'YourFont', sans-serif;
  }
}
```

2. **In `tailwind.config.js`:**
```javascript
theme: {
  fontFamily: {
    sans: ['YourFont', 'system-ui'],
  }
}
```

### Dark Mode

**Enable Dark Mode:**

1. **Update `tailwind.config.js`:**
```javascript
export default {
  darkMode: 'class',
  theme: {
    extend: {}
  }
}
```

2. **Add Toggle Component:**
```jsx
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggle}>
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
```

3. **Use Dark Classes:**
```jsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

---

## 🎯 Feature Customization

### Add New Food Categories

**In `src/utils/constants.js`:**
```javascript
export const FOOD_TYPES = [
  { value: "cooked", label: "Cooked Food", emoji: "🍲" },
  { value: "fresh", label: "Fresh Produce", emoji: "🥗" },
  // Add new:
  { value: "frozen", label: "Frozen Items", emoji: "🧊" },
  { value: "dairy", label: "Dairy Products", emoji: "🥛" },
];
```

### Modify Listing Fields

**Add custom field to listings:**

1. **Update Firestore Schema** (in `firebase-rules.txt`):
```javascript
// In listing validation add:
request.resource.data.customField != null
```

2. **Update Form** (in `src/pages/ListFoodPage.jsx`):
```jsx
<Input
  label="Custom Field"
  {...register("customField")}
  error={errors.customField?.message}
/>
```

3. **Update Listing Card** (in `src/components/ListingCard.jsx`):
```jsx
<p className="text-sm">{listing.customField}</p>
```

### Add New Pages

**Create new page:**

1. **Create file** `src/pages/NewPage.jsx`:
```jsx
export const NewPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">New Page</h1>
      {/* Your content */}
    </div>
  );
};
```

2. **Add to pages export** `src/pages/index.js`:
```javascript
export { NewPage } from "./NewPage";
```

3. **Add route** in `src/App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

4. **Add to navigation** in `src/components/Header.jsx`:
```jsx
<Link to="/new-page" className="...">
  New Page
</Link>
```

---

## 📱 Responsive Design

### Mobile-First Approach

All components use Tailwind's responsive prefixes:

```jsx
<div className="
  grid-cols-1          // Mobile: 1 column
  md:grid-cols-2       // Tablet: 2 columns
  lg:grid-cols-3       // Desktop: 3 columns
">
```

### Test Responsiveness

```bash
# Chrome DevTools: Device Toolbar (Ctrl+Shift+M)
# Firefox: Responsive Design Mode (Ctrl+Shift+M)
# Safari: Responsive Design Mode (Cmd+Shift+R)
```

---

## 🔄 State Management

### Add New Global State

1. **Create store** `src/store/myStore.js`:
```javascript
import { create } from "zustand";

export const useMyStore = create((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  getItems: () => get().items,
}));
```

2. **Use in component:**
```jsx
import { useMyStore } from "../store/myStore";

export const MyComponent = () => {
  const { items, addItem } = useMyStore();
  
  return <div>{items.length}</div>;
};
```

---

## 🔌 API Integration

### Add Third-Party API

**Example: Weather API**

1. **Create service** `src/services/weatherService.js`:
```javascript
import axios from "axios";

export const weatherService = {
  getWeather: async (lat, lng) => {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude: lat,
          longitude: lng,
          current: 'temperature_2m'
        }
      }
    );
    return response.data;
  }
};
```

2. **Use in component:**
```jsx
import { weatherService } from "../services/weatherService";

const [weather, setWeather] = useState(null);

useEffect(() => {
  weatherService.getWeather(lat, lng).then(setWeather);
}, [lat, lng]);
```

---

## 📊 Analytics Integration

### Google Analytics 4

1. **Install:**
```bash
npm install @react-ga/core @react-ga/react-router
```

2. **Setup** in `src/main.jsx`:
```javascript
import ReactGA from '@react-ga/core';

ReactGA.initialize('GA-MEASUREMENT-ID');
```

3. **Track events:**
```javascript
import { event } from '@react-ga/core';

event({
  category: 'listings',
  action: 'create_listing',
  label: 'Food Type: Fresh',
});
```

---

## 🧪 Testing

### Unit Tests (Vitest/Jest)

1. **Install:**
```bash
npm install -D vitest @testing-library/react
```

2. **Create test** `src/utils/__tests__/helpers.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../helpers';

describe('calculateDistance', () => {
  it('calculates correctly', () => {
    const distance = calculateDistance(40, -74, 40.7, -74.01);
    expect(distance).toBeLessThan(10);
  });
});
```

3. **Run tests:**
```bash
npm run test
```

---

## 🚀 Performance Optimization

### Code Splitting

**Lazy load routes:**

```jsx
import { lazy, Suspense } from 'react';
import { Loader } from 'lucide-react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));

export const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader className="animate-spin" size={32} />
  </div>
);

// In routes:
<Suspense fallback={<Loading />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Suspense>
```

### Image Optimization

**Lazy load images:**
```jsx
<img
  src={imageUrl}
  loading="lazy"
  decoding="async"
  alt={title}
/>
```

---

## 🔐 Security Hardening

### Content Security Policy (CSP)

**Add to `index.html`:**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://maps.googleapis.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
">
```

### Input Sanitization

```javascript
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
```

---

## 📦 Building & Deployment

### Build Optimization

```bash
# Check bundle size
npm run build -- --analyze

# Optimize
npm install -D vite-plugin-compression
```

### Docker Deployment

**Create `Dockerfile`:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🎓 Common Customization Recipes

### Change App Language/Localization

```javascript
// src/utils/i18n.js
export const translations = {
  en: {
    'list_food': 'List Food',
    'view_listings': 'View Listings',
  },
  es: {
    'list_food': 'Publicar Comida',
    'view_listings': 'Ver Listados',
  }
};

export const useI18n = (lang = 'en') => {
  return (key) => translations[lang][key];
};
```

### Add Email Notifications

```javascript
// src/services/emailService.js
export const emailService = {
  sendPickupNotification: async (email, listing) => {
    // Use Firebase Cloud Functions or SendGrid
    const response = await axios.post('/api/send-email', {
      to: email,
      subject: `Pickup Scheduled: ${listing.title}`,
      body: `Your pickup has been scheduled...`
    });
    return response.data;
  }
};
```

### Implement Multilingual Support

```bash
npm install i18next react-i18next
```

```jsx
// In App.jsx
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

<I18nextProvider i18n={i18n}>
  <Routes>...</Routes>
</I18nextProvider>
```

---

## 🐛 Debugging Tips

### Enable Detailed Logging

```javascript
// src/utils/logger.js
export const logger = {
  debug: (label, data) => {
    if (import.meta.env.DEV) {
      console.log(`🐛 ${label}:`, data);
    }
  },
  error: (label, error) => {
    console.error(`❌ ${label}:`, error);
  },
  success: (label, data) => {
    console.log(`✅ ${label}:`, data);
  }
};
```

### React DevTools

```bash
# Install extension for Chrome/Firefox
# Then inspect components and timing
```

### Firebase Console

- Monitor Firestore usage and data
- Check authentication logs
- View storage files
- Track analytics events

---

## 📚 Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)

---

**Remember:** Always test customizations thoroughly before deploying!

**Last Updated:** April 2026
