import { createBrowserRouter, Outlet } from "react-router";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AIDoctorPage from "./pages/AIDoctorPage";
import ScrollToTop from "./components/ScrollToTop";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMedicines from "./pages/admin/AdminMedicines";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCarousel from "./pages/admin/AdminCarousel";

// User Dashboard
import UserLayout from "./pages/dashboard/UserLayout";
import UserDashboard from "./pages/dashboard/UserDashboard";
import UserOrders from "./pages/dashboard/UserOrders";
import UserWishlist from "./pages/dashboard/UserWishlist";
import UserPrescriptions from "./pages/dashboard/UserPrescriptions";
import UserProfile from "./pages/dashboard/UserProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "ai-doctor", Component: AIDoctorPage },

      // Admin Routes
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "users", Component: AdminUsers },
          { path: "medicines", Component: AdminMedicines },
          { path: "orders", Component: AdminOrders },
          { path: "carousel", Component: AdminCarousel },
          { path: "messages", Component: AdminMessages },
          { path: "analytics", Component: AdminAnalytics },
          { path: "settings", Component: AdminSettings },
        ],
      },

      // User Dashboard Routes
      {
        path: "dashboard",
        Component: UserLayout,
        children: [
          { index: true, Component: UserDashboard },
          { path: "orders", Component: UserOrders },
          { path: "wishlist", Component: UserWishlist },
          { path: "prescriptions", Component: UserPrescriptions },
          { path: "profile", Component: UserProfile },
        ],
      },
    ],
  },
]);