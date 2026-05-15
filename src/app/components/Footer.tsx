import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>
              <span className="ml-2 text-2xl font-bold text-white">
                DawaiGhor
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted online pharmacy delivering authentic medicines and healthcare products to your doorstep with care.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="hover:text-orange-500 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-orange-500 transition-colors text-sm">
                  Shop Medicines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  Healthcare Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  Lab Tests
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  Consult Doctors
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Call Us</p>
                  <a href="tel:+8801234567890" className="text-sm hover:text-orange-500 transition-colors">
                    +880 1234-567890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <a href="mailto:support@dawaighor.com" className="text-sm hover:text-orange-500 transition-colors">
                    support@dawaighor.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Address</p>
                  <p className="text-sm">
                    123 Health Street, Dhaka 1000, Bangladesh
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-semibold text-xl mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on health tips, special offers, and new products
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center lg:text-left">
              © {currentYear} DawaiGhor. All rights reserved. | Registered Pharmacy License: #DG-2026-BD
            </p>

            {/* Payment Methods */}
            <div className="flex flex-col items-center lg:items-end gap-3">
              <span className="text-sm text-gray-400 font-medium">We Accept:</span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Visa */}
                <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                    <path d="M18.5 1.5h-3.2L12 14.5h3.2l3.3-13z" fill="#00579F"/>
                    <path d="M29.2 1.7c-.6-.2-1.6-.5-2.8-.5-3.1 0-5.3 1.6-5.3 4 0 1.7 1.5 2.7 2.7 3.3 1.2.6 1.6 1 1.6 1.5 0 .8-.9 1.1-1.8 1.1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.5c.7.3 2.1.6 3.5.6 3.3 0 5.4-1.6 5.4-4.1 0-1.4-.8-2.4-2.6-3.3-1.1-.6-1.7-.9-1.7-1.5 0-.5.6-1 1.8-1 1 0 1.8.2 2.3.4l.3.1.4-2.3z" fill="#00579F"/>
                    <path d="M35.9 1.5h-2.5c-.8 0-1.3.2-1.7 1l-4.7 11.9h3.3s.5-1.4.7-1.8h4c.1.4.4 1.8.4 1.8h2.9L35.9 1.5zm-4.6 8.4c.2-.7 1.3-3.5 1.3-3.5s.3-.7.4-1.2l.2 1.1s.6 2.9.8 3.6h-2.7z" fill="#00579F"/>
                    <path d="M10.8 1.5L7.6 10l-.3-1.7C6.7 6 4.8 3.5 2.7 2.2l2.9 12.2h3.4l5-13h-3.2z" fill="#00579F"/>
                    <path d="M4.5 1.5H.1L0 1.8c4 1 6.6 3.4 7.7 6.3l-1.1-5.5c-.2-.8-.7-1-1.4-1h-.7z" fill="#FAA61A"/>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                    <circle cx="18" cy="15" r="12" fill="#EB001B"/>
                    <circle cx="30" cy="15" r="12" fill="#F79E1B"/>
                    <path d="M24 6.4c2.3 1.9 3.8 4.8 3.8 8.1s-1.5 6.2-3.8 8.1c-2.3-1.9-3.8-4.8-3.8-8.1s1.5-6.2 3.8-8.1z" fill="#FF5F00"/>
                  </svg>
                </div>

                {/* American Express */}
                <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                    <rect width="48" height="30" rx="3" fill="#006FCF"/>
                    <path d="M15.5 12.5h-3.2l-1.8 4.2-1.8-4.2H5.5l3.2 7h2.4l1.7-4 1.7 4h2.4l3.2-7h-3.2l-1.6 4.2zm8.8-1.2h-5.7v1.4h5.4v1.8h-5.4v1.5h5.7v1.8h-8.2v-8.3h8.2v1.8zm5.2 7l-1.1-2h-2.3l-1.1 2h-2.8l4.8-8.3h2.5l4.8 8.3h-2.8l-1-2h-1zm-1.5-3.8l-.8-1.5-.8 1.5h1.6z" fill="white"/>
                  </svg>
                </div>

                {/* bKash */}
                <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-1">
                  <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">bK</span>
                  </div>
                  <span className="text-pink-600 font-bold text-sm">bKash</span>
                </div>

                {/* Nagad */}
                <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-1">
                  <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">N</span>
                  </div>
                  <span className="text-orange-600 font-bold text-sm">Nagad</span>
                </div>

                {/* Rocket */}
                <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-1">
                  <div className="w-6 h-6 bg-purple-700 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">R</span>
                  </div>
                  <span className="text-purple-700 font-bold text-sm">Rocket</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Certifications */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Licensed Pharmacy</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Verified Products</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>100% Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
