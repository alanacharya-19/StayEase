# StayEase - Premium Hotel Booking Website

A modern, production-quality hotel booking website built with React 19, Vite, Tailwind CSS, and cutting-edge frontend technologies.

## 🚀 Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool
- **React Router DOM v6** - Routing
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP Client
- **React Hook Form + Zod** - Form Validation
- **TanStack Query** - Server State Management
- **Zustand** - Client State Management
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## ✨ Features

- **12+ Pages**: Landing, Hotels, Hotel Details, Room Details, Booking, Payment, Login, Register, Dashboard, Wishlist, About, Contact
- **Dark/Light Mode**: Persisted theme with smooth transitions
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile
- **Advanced Search & Filters**: City, country, price range, star rating, amenities
- **Sorting**: By price, rating, and popularity
- **Pagination**: Client-side pagination for hotel listings
- **User Authentication**: Login and registration with Zod validation
- **Wishlist**: Save and manage favorite hotels
- **Booking System**: Complete booking flow with price breakdown
- **Mock Payment**: Multiple payment methods (Credit Card, UPI, PayPal, Cash)
- **Receipt Download**: Download booking receipt as text file
- **User Dashboard**: Profile management, booking history, upcoming trips
- **Animations**: Framer Motion page transitions, hover effects, image zoom
- **Lazy Loading**: Code-split pages for optimal performance
- **Glassmorphism**: Modern glass UI effects
- **Skeleton Loaders**: Loading states for better UX
- **Search Suggestions**: Real-time search suggestions
- **Breadcrumbs**: Navigation breadcrumbs on inner pages
- **Newsletter**: Email subscription form
- **FAQ**: Accordion-style frequently asked questions

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── cards/           # HotelCard, RoomCard, ReviewCard, BookingCard
│   ├── forms/           # SearchBar
│   ├── layout/          # Navbar, Footer
│   └── ui/              # Loader, Skeleton, Modal, Rating, Pagination, Breadcrumb, ImageCarousel
├── constants/           # App constants
├── data/                # Dummy data (hotels, destinations, testimonials)
├── hooks/               # Custom hooks (useQueries, useIntersectionObserver)
├── layouts/             # MainLayout
├── pages/               # All page components
├── routes/              # Route configuration
├── services/            # API services (auth, hotel, booking, review)
├── store/               # Zustand stores (theme, auth, wishlist, booking, hotels)
├── styles/              # Global styles
└── utils/               # Utility functions
```

## 🛠️ Installation

```bash
# Clone the repository
git clone <repo-url>
cd stayease

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧩 Dummy Data

The app uses comprehensive dummy data so it works fully without a backend. The data includes:

- **10 Hotels** across 9 cities and 7 countries
- **20+ Rooms** with different types, bed configs, and pricing
- **6 Popular Destinations** with images
- **4 Testimonials** from guests
- **6 FAQs** covering common questions
- **4 Team Members** for the About page
- **20+ Amenities** for filtering

## 🎨 Design Highlights

- Modern glassmorphism UI with backdrop blur
- Gradient accents and text effects
- Smooth Framer Motion animations on every page
- Responsive grid layouts that adapt to all screen sizes
- Consistent spacing and typography with Inter + Playfair Display fonts
- Premium card designs with hover effects
- Elegant dark mode with proper color contrast

## 🌐 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, search, destinations, featured hotels, deals, testimonials, FAQ, newsletter |
| Hotels | `/hotels` | Search, filters, sort, pagination |
| Hotel Details | `/hotels/:id` | Gallery, info, amenities, policies, map, rooms, reviews |
| Room Details | `/hotels/:id/rooms/:roomId` | Room info, facilities, booking |
| Booking | `/booking` | Form with validation, price breakdown |
| Payment | `/payment` | Multiple payment methods, success page |
| Login | `/login` | Email/password with Zod validation |
| Register | `/register` | Full registration with confirm password |
| Dashboard | `/dashboard` | Profile, bookings, trips, wishlist, reviews, settings |
| Wishlist | `/wishlist` | Saved hotels management |
| About | `/about` | Company info, mission, vision, team |
| Contact | `/contact` | Contact form, map, support info |
| 404 | `*` | Custom 404 page |

## 📄 License

MIT
