import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BecomeHostPage from './pages/BecomeHostPage';
import BecomeHostApplicationPage from './pages/BecomeHostApplicationPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminHotelsPage from './pages/admin/AdminHotelsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminBookingDetailsPage from './pages/admin/AdminBookingDetailsPage';
import AdminListingApprovalsPage from './pages/admin/AdminListingApprovalsPage';
import AdminListingDetailsPage from './pages/admin/AdminListingDetailsPage';
import AdminHostApplicationsPage from './pages/admin/AdminHostApplicationsPage';
import AdminHostApplicationDetailPage from './pages/admin/AdminHostApplicationDetailPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage';
import HostListingsPage from './pages/host/HostListingsPage';
import CreateListingPage from './pages/host/CreateListingPage';
import ViewListingPage from './pages/host/ViewListingPage';
import EditListingPage from './pages/host/EditListingPage';
import HostReservationsPage from './pages/host/HostReservationsPage';
import HostReservationDetailsPage from './pages/host/HostReservationDetailsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import ReservationConfirmationPage from './pages/ReservationConfirmationPage';

function App() {
  return (
    <AuthProvider>
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
                  <Route path="/become-host" element={<BecomeHostPage />} />
                  <Route path="/become-host/application" element={<BecomeHostApplicationPage />} />
                  
                  {/* Guest routes - Protected */}
                  <Route path="/reservation-confirmation" element={
                    <ProtectedRoute>
                      <ReservationConfirmationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-reservations" element={
                    <ProtectedRoute>
                      <MyReservationsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Host routes - Protected */}
                  <Route path="/host/listings" element={
                    <ProtectedRoute requireRole="host">
                      <HostListingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/listings/new" element={
                    <ProtectedRoute requireRole="host">
                      <CreateListingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/listings/:id" element={
                    <ProtectedRoute requireRole="host">
                      <ViewListingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/listings/:id/edit" element={
                    <ProtectedRoute requireRole="host">
                      <EditListingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/reservations" element={
                    <ProtectedRoute requireRole="host">
                      <HostReservationsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/reservations/:id" element={
                    <ProtectedRoute requireRole="host">
                      <HostReservationDetailsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Admin routes with AdminLayout (no Navbar/Footer) - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="hotels" element={<AdminHotelsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="bookings/:id" element={<AdminBookingDetailsPage />} />
          <Route path="approvals" element={<AdminListingApprovalsPage />} />
          <Route path="listings/:id" element={<AdminListingDetailsPage />} />
          <Route path="host-applications" element={<AdminHostApplicationsPage />} />
          <Route path="host-applications/:id" element={<AdminHostApplicationDetailPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailsPage />} />
          <Route path="customers" element={<div className="text-center py-12 text-gray-500">Customers Management - Coming Soon</div>} />
          <Route path="settings" element={<div className="text-center py-12 text-gray-500">Settings - Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
