import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with Navbar and Footer */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/hotels" element={<HotelsPage />} />
                  <Route path="/hotels/:id" element={<HotelDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Admin routes with AdminLayout (no Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Placeholder routes for future admin pages */}
          <Route path="hotels" element={<div className="text-center py-12 text-gray-500">Hotels Management - Coming Soon</div>} />
          <Route path="bookings" element={<div className="text-center py-12 text-gray-500">Bookings Management - Coming Soon</div>} />
          <Route path="customers" element={<div className="text-center py-12 text-gray-500">Customers Management - Coming Soon</div>} />
          <Route path="settings" element={<div className="text-center py-12 text-gray-500">Settings - Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
