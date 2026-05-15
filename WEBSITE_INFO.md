# DawaiGhor - Online Pharmacy Website

## Overview
DawaiGhor is a fully functional online pharmacy website designed to match the provided Figma design pixel-perfectly. It includes modern features, smooth animations, and complete e-commerce functionality using local storage for data persistence.

## Features

### 🏠 Homepage
- **Promotional Banner** - Special offers and announcements
- **Hero Section** - Eye-catching hero with call-to-action buttons
- **AI Doctor Integration** - Interactive chatbot for medical consultations
- **Features Showcase** - Highlights key benefits (Free AI Consultation, Authentic Medicines, Fast Delivery, Secure Payments)
- **Category Navigation** - Browse by medicine categories
- **Trending Products** - Featured products with add-to-cart functionality

### 🛍️ Products Page
- **Category Filtering** - Filter products by category (All, Prescription Medicine, OTC, Baby Care, etc.)
- **Product Grid** - Responsive grid layout with product cards
- **Real Product Images** - High-quality images from Unsplash
- **Quick Add to Cart** - One-click add to cart with toast notifications

### 🛒 Shopping Cart
- **Cart Management** - Add, remove, update quantities
- **Order Summary** - Real-time calculation of subtotal, shipping, and total
- **Free Shipping Indicator** - Shows how much more to spend for free shipping
- **Empty Cart State** - Beautiful empty state with call-to-action

### 🤖 AI Doctor Chatbot
- **Interactive Chat Interface** - Modern chat UI with quick response buttons
- **Smart Responses** - Context-aware responses based on symptoms
- **Quick Symptom Selection** - Pre-defined symptom buttons for faster interaction
- **Medical Advice** - Provides basic health advice (demo mode)

### 💾 Local Storage Features
- **Persistent Cart** - Cart data saved to browser local storage
- **Cross-session Persistence** - Cart persists across browser sessions
- **Real-time Updates** - Cart count updates across all components

### 🎨 Design & UI
- **Premium Design** - Matches the original Figma design exactly
- **Orange Color Scheme** - Primary orange (#FF6B35) used throughout
- **Smooth Animations** - Motion animations for all interactive elements
- **Custom Scrollbar** - Branded orange scrollbar
- **Responsive Layout** - Works on all screen sizes (mobile, tablet, desktop)
- **Toast Notifications** - Beautiful success messages for user actions

### 🔧 Technical Features
- **React Router** - Multi-page navigation
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Motion** - Smooth animations
- **Lucide Icons** - Modern icon set
- **Component-based Architecture** - Reusable UI components

## Pages

1. **Home (/)** - Main landing page with all sections
2. **Products (/products)** - Browse and filter all products
3. **Cart (/cart)** - View and manage shopping cart

## Mock Data

The website includes 10 mock products across different categories:
- Prescription Medicine (Napa 500mg)
- OTC (Hand Sanitizer, Cough Syrup)
- Baby Care (Diapers, Wipes)
- Devices & Kits (Surgical Masks, Digital Thermometer)
- Vitamins & Supplements (Vitamin D3, Omega-3)
- Women's Choice (Folic Acid)

## Color Palette

- **Primary Orange**: #FF6B35 (Buttons, accents, branding)
- **Dark Gray**: #374151, #1F2937 (Text, backgrounds)
- **Light Orange**: #FFF7ED, #FFEDD5 (Backgrounds, highlights)
- **White**: #FFFFFF (Cards, backgrounds)

## Typography

- Clean, modern sans-serif font
- Bold headings for impact
- Medium weight for buttons and labels
- Regular weight for body text

## Key Components

- `Header` - Navigation with search, upload prescription, cart
- `Footer` - Links, contact info, payment methods
- `HeroSection` - Main banner with CTA
- `FeaturesSection` - 4-column feature highlights
- `CategoriesSection` - 6-category grid
- `TrendingProducts` - Product carousel
- `AIHelpSection` - AI consultation preview
- `AIDoctorChat` - Interactive chatbot modal
- `PromoBanner` - Dismissible promotional banner

## Local Storage Structure

### Cart Data
```json
{
  "dawaiGhorCart": [
    {
      "id": "1",
      "name": "Product Name",
      "price": 10.99,
      "quantity": 2,
      "category": "Category Name",
      "image": "image-url",
      "description": "Product description"
    }
  ]
}
```

### User Data (Future Enhancement)
```json
{
  "dawaiGhorUser": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Future Enhancements

- User authentication
- Order history
- Prescription upload functionality
- Real AI doctor integration
- Payment gateway integration
- Order tracking
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Multi-language support

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- All modern browsers with localStorage support

## Performance

- Fast page loads
- Optimized images from Unsplash CDN
- Lazy loading for images
- Efficient state management
- Minimal re-renders

---

Built with ❤️ for DawaiGhor - Your Smart Health Companion & Online Pharmacy
