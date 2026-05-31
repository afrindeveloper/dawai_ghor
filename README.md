# DawaiGhor - Modern E-Pharmacy & Healthcare Platform 🏥💊

DawaiGhor is a premium, full-stack digital healthcare and e-pharmacy platform. Designed with modern web standards, it seamlessly connects patients with essential medicines, AI-powered health consultations, and intelligent prescription analysis.

![DawaiGhor Banner](public/images/hero_ai_health.png)

## ✨ Key Features

### 🛒 Intelligent E-Commerce & Pharmacy
- **Robust Shopping Cart:** Session-based, fully persisted cart utilizing MongoDB (no local storage dependency) allowing guest checkouts and cross-device sync.
- **Wishlist System:** Save medicines for later with a single click.
- **Dynamic Product Filtering:** Easily browse medicines by categories (Prescription, OTC, Supplements) and search functionality.
- **Order Tracking:** Users can view and track their complete order history directly from their dashboard.

### 🤖 AI-Powered Capabilities (Gemini Integration)
- **AI Prescription Parser:** Users can upload handwritten or digital prescriptions (images/PDFs) and the Gemini AI instantly extracts the prescribed medicines, maps them to the store inventory, and prepares a ready-to-order cart.
- **AI Doctor Assistant:** Integrated chat assistant that can provide instant, automated health advice and medication information.

### 🔐 Security & Architecture
- **Complete MongoDB Integration:** 100% of the application's data—ranging from user accounts to temporary carts—is securely stored in MongoDB.
- **HTTP-Only Session Cookies:** Authentication and session tracking are handled securely via backend cookies (`cookie-parser`), completely eliminating client-side `localStorage` vulnerabilities.
- **Full-Stack Type Safety:** Built with strict TypeScript across the React frontend to ensure exceptional reliability.

### 👑 Admin & User Dashboards
- **Admin Dashboard:** Total control over the platform. Admins can track revenue, process active orders, manage users, edit inventory, respond to contact messages, and customize the homepage carousel.
- **User Dashboard:** A personalized space for customers to view order statuses, manage their profile, review AI-parsed prescriptions, and manage their wishlist.

## 🛠️ Technology Stack

### Frontend
- **React 18** via **Vite**
- **TypeScript**
- **Tailwind CSS** for responsive, utility-first styling
- **Framer Motion** for fluid, dynamic micro-animations
- **Lucide React** for premium iconography
- **React Router** for seamless SPA navigation

### Backend
- **Node.js & Express.js**
- **MongoDB** & **Mongoose** (Database & ODM)
- **Cookie-Parser** (Session Management)
- **Google Gemini API** (AI Prescription & Chat)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance
- Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/afrindeveloper/dawai_ghor.git
   cd dawai_ghor
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   
   Create a `.env` file inside the `/server` directory:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Run the Application (Concurrently):**
   ```bash
   # From the root directory
   npm run dev
   ```
   This script spins up both the Vite frontend (`localhost:5173`) and the Express backend (`localhost:5001`) simultaneously.

## 👮 Admin Access
To access the admin panel, you can log in using the default admin credentials (or configure them directly in the MongoDB cluster):
- **Email:** `admin@dawai.com`
- **Password:** `admin123`

---
*Built with ❤️ for better, smarter healthcare access.*