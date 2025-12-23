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
import AdminHotelsPage from './pages/admin/AdminHotelsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import HostListingsPage from './pages/host/HostListingsPage';
import CreateListingPage from './pages/host/CreateListingPage';
import ViewListingPage from './pages/host/ViewListingPage';
import EditListingPage from './pages/host/EditListingPage';
import HostReservationsPage from './pages/host/HostReservationsPage';

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
                  
                  {/* Host routes */}
                  <Route path="/host/listings" element={<HostListingsPage />} />
                  <Route path="/host/listings/new" element={<CreateListingPage />} />
                  <Route path="/host/listings/:id" element={<ViewListingPage />} />
                  <Route path="/host/listings/:id/edit" element={<EditListingPage />} />
                  <Route path="/host/reservations" element={<HostReservationsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Admin routes with AdminLayout (no Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="hotels" element={<AdminHotelsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="customers" element={<div className="text-center py-12 text-gray-500">Customers Management - Coming Soon</div>} />
          <Route path="settings" element={<div className="text-center py-12 text-gray-500">Settings - Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
