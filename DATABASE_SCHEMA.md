# Database Schema Documentation

## Overview
This document describes the MySQL database schema for the **Distributed Apartment Reservation System (DARS)**. The database uses a relational model with five main entities: Users, Listings, Listing Images, Reservations, and Host Applications. The system implements a comprehensive approval workflow for both host applications and property listings.

---

## Database: `hotel_db`

### 1. **users** Table
Stores all system users (guests, hosts, admins, and banned users).

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('guest', 'host', 'admin', 'banned') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY (email)`

**Notes:**
- Passwords must be hashed (bcrypt recommended) before insertion
- Role determines access permissions throughout the system
- Email serves as the unique login identifier
- **Role Types:**
  - `guest`: Can browse and book listings
  - `host`: Can create and manage listings, view reservations
  - `admin`: Full system access, approves host applications and listings
  - `banned`: User account is disabled

---

### 2. **listings** Table
Stores property listings created by hosts (subject to admin approval).

```sql
CREATE TABLE listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(100),
    price_per_night DECIMAL(10,2) NOT NULL,
    max_guests INT DEFAULT 1,
    beds INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Indexes:**
- `PRIMARY KEY (id)`
- `KEY (user_id)`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)`

**Notes:**
- Only users with role='host' can create listings
- New listings default to 'approved' status (can be changed to 'pending' for approval workflow)
- **Status Workflow:** pending → approved/rejected (by admin)
- Listings are linked to their creator via user_id
- Price stored with 2 decimal precision
- Property details (beds, bathrooms) help guests make informed booking decisions

---

### 3. **listing_images** Table
Stores multiple images for each listing.

```sql
CREATE TABLE listing_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
```

**Indexes:**
- `PRIMARY KEY (id)`
- `KEY (listing_id)`

**Foreign Keys:**
- `listing_id` REFERENCES `listings(id)` ON DELETE CASCADE

**Notes:**
- Each listing can have multiple images
- Images are automatically deleted when the parent listing is removed (CASCADE)
- URLs typically point to uploaded images on server (e.g., `http://localhost:8080/uploads/images/uuid.jpg`)
- First image typically serves as the listing thumbnail

---

### 4. **reservations** Table
Stores booking information for listings with guest contact details.

```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    user_id INT NOT NULL,
    guest_phone VARCHAR(20),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    guest_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Indexes:**
- `PRIMARY KEY (id)`
- `KEY (listing_id)`
- `KEY (user_id)`

**Foreign Keys:**
- `listing_id` REFERENCES `listings(id)`
- `user_id` REFERENCES `users(id)`

**Notes:**
- Hosts can view reservations for their listings
- Guests can view their own reservations
- **Status Workflow:** pending → confirmed/cancelled
- total_price is calculated as: (check_out - check_in) × price_per_night
- guest_phone and guest_notes provide additional communication channels
- Guest contact information helps hosts prepare for arrivals

---

### 5. **host_applications** Table
Stores applications from users requesting to become hosts.

```sql
CREATE TABLE host_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    id_card_number VARCHAR(50) NOT NULL,
    motivation TEXT,
    experience TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_application (user_id)
);
```

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY unique_user_application (user_id)`
- `KEY idx_status (status)`
- `KEY idx_user_id (user_id)`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**Notes:**
- Each user can have only ONE host application (enforced by UNIQUE constraint)
- **Status Workflow:** pending → approved/rejected (by admin)
- When approved, user's role is changed from 'guest' to 'host'
- admin_notes can explain rejection reasons or provide feedback
- ID card number is required for verification purposes
- Cascade delete: application is removed if user is deleted

---

### 6. **rooms** Table (Legacy - Not Currently Used)
This table exists in the database but is not actively used by the current application.

```sql
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    price DOUBLE
);
```

**Notes:**
- This table is from an earlier version of the system
- Not referenced by current application code
- Can be safely ignored or removed

---

### 5. rooms (Legacy Table)
Original room management table from the RMI server.

```sql
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    price DOUBLE
);
```

---

## Role-Based Access Rules

### 🟪 HOST Role

**Permissions:**
- Create new listings (user_id = current user)
- Update ONLY their own listings (WHERE listings.user_id = host.id)
- Delete ONLY their own listings
- Upload images to their listings
- View reservations for their listings

**Restrictions:**
- Cannot modify listings owned by other hosts
- Cannot view reservations for listings they don't own

**Ownership Verification Query:**
```sql
SELECT user_id FROM listings WHERE id = :listingId;
-- If user_id != currentUser.id → return 403 Forbidden
```

**Host Listings Query:**
```sql
SELECT * FROM listings WHERE user_id = :hostId;
```

**Host Reservations Query:**
```sql
SELECT r.*, l.title as listing_title, u.name as guest_name, u.email as guest_email
FROM reservations r
JOIN listings l ON r.listing_id = l.id
JOIN users u ON r.user_id = u.id
WHERE l.user_id = :hostId
ORDER BY r.check_in DESC;
```

## Sample Data

### Insert Sample Users
```sql
INSERT INTO users (name, email, password, role) VALUES
('John Host', 'host@example.com', 'hashed_password_here', 'host'),
('Jane Guest', 'guest@example.com', 'hashed_password_here', 'guest'),
('Admin User', 'admin@example.com', 'hashed_password_here', 'admin');
```

### Insert Sample Listings
```sql
INSERT INTO listings (user_id, title, description, address, city, price_per_night, max_guests, beds, bathrooms, status) VALUES
(1, 'Cozy Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of the city', '123 Main St', 'Casablanca', 150.00, 4, 2, 1, 'approved'),
(1, 'Beach House Paradise', 'Stunning beachfront property with ocean views', '456 Ocean Dr', 'Agadir', 250.00, 6, 3, 2, 'approved');
```

### Insert Sample Images
```sql
INSERT INTO listing_images (listing_id, image_url) VALUES
(1, 'http://localhost:8080/uploads/images/apartment1.jpg'),
(1, 'http://localhost:8080/uploads/images/apartment2.jpg'),
(2, 'http://localhost:8080/uploads/images/beach1.jpg');
```

### Insert Sample Reservations
```sql
INSERT INTO reservations (listing_id, user_id, guest_phone, check_in, check_out, total_price, status, guest_notes) VALUES
(1, 2, '+212612345678', '2026-02-15', '2026-02-20', 750.00, 'confirmed', 'Early check-in requested'),
(2, 2, '+212623456789', '2026-03-01', '2026-03-05', 1000.00, 'pending', NULL);
```

### Insert Sample Host Application
```sql
INSERT INTO host_applications (user_id, phone_number, address, city, id_card_number, motivation, experience, status) VALUES
(4, '+212634567890', '789 Residence St', 'Marrakech', 'AB123456', 'I love hospitality and want to share my properties', '5 years of property management', 'pending');
```

---

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/users/{id}` - Get user profile
- `PUT /api/auth/users/{id}` - Update user profile
- `PUT /api/auth/users/{id}/password` - Change password

### Public Endpoints (Guest Access)
- `GET /api/listings` - Get all approved listings
- `GET /api/listings/{id}` - Get listing details
- `GET /api/listings/search?city={city}` - Search listings by city
- `POST /api/listings/{id}/reserve` - Create reservation (requires authentication)

### Host Endpoints (Requires: role=host)
- `POST /api/host/listings` - Create listing (sets user_id from header)
- `PUT /api/host/listings/{id}` - Update listing (ownership verified)
- `DELETE /api/host/listings/{id}` - Delete listing (ownership verified)
- `GET /api/host/listings` - Get host's listings
- `GET /api/host/listings/{id}` - Get specific listing (ownership verified)
- `POST /api/host/listings/{id}/images` - Add image (ownership verified)
- `GET /api/host/reservations` - Get all reservations for host's listings
- `GET /api/host/listings/{id}/reservations` - Get reservations for specific listing
- `PATCH /api/host/reservations/{id}/status` - Update reservation status (confirm/cancel)

### Host Application Endpoints
- `POST /api/host-applications` - Submit host application (user must be guest)
- `GET /api/host-applications/my-application` - Get user's application status

### Admin Endpoints (Requires: role=admin)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user details
- `PUT /api/admin/users/{id}/role` - Change user role
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/host-applications` - Get all host applications
- `GET /api/admin/host-applications/{id}` - Get application details
- `PUT /api/admin/host-applications/{id}/approve` - Approve application (changes user role to 'host')
- `PUT /api/admin/host-applications/{id}/reject` - Reject application
- `GET /api/admin/listings` - Get all listings (pending, approved, rejected)
- `PUT /api/admin/listings/{id}/status` - Update listing status (approve/reject)
- `GET /api/admin/reservations` - Get all reservations
- `GET /api/admin/reservations/{id}` - Get reservation details

### Required Headers for Protected Endpoints
```
X-User-Id: {userId}
X-User-Role: {role}
```

---

## Database Setup Commands

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hotel_db;"

# Import the schema (using the hotel_db.sql dump file)
mysql -u root -p hotel_db < hotel_db.sql

# Grant permissions (if using a specific database user)
mysql -u root -p -e "GRANT ALL PRIVILEGES ON hotel_db.* TO 'hotel_user'@'localhost' IDENTIFIED BY 'password';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

---

## RMI Services

### UserService
- `registerUser(User user)` - Register new user
- `loginUser(String email, String password)` - Authenticate user
- `getUserById(int userId)` - Get user by ID
- `updateUserProfile(int userId, String name, String email)` - Update user info
- `changePassword(int userId, String currentPassword, String newPassword)` - Change password

### ListingService
- `createListing(Listing listing)` - Create new listing
- `updateListing(Listing listing, int currentUserId)` - Update listing (throws AuthorizationException)
- `deleteListing(int listingId, int currentUserId)` - Delete listing (throws AuthorizationException)
- `getListingsByHost(int hostId)` - Get all listings by a host
- `getListingById(int listingId)` - Get listing details
- `getAllListings()` - Get all approved listings
- `getListingsByCity(String city)` - Search listings by city
- `addListingImage(int listingId, String imageUrl, int currentUserId)` - Add image (throws AuthorizationException)
- `updateListingStatus(int listingId, String status)` - Update listing status (admin only)

### ReservationService
- `createReservation(Reservation reservation)` - Create new reservation
- `getReservationsByHost(int hostId)` - Get all reservations for host's listings
- `getReservationsByUser(int userId)` - Get user's reservations
- `getReservationsByListing(int listingId, int currentUserId)` - Get reservations for specific listing (throws AuthorizationException)
- `getReservationById(int reservationId)` - Get reservation details
- `updateReservationStatus(int reservationId, String newStatus, int currentUserId)` - Update status (throws AuthorizationException)
- `getAllReservations()` - Get all reservations (admin only)

### HostApplicationService
- `submitApplication(HostApplication application)` - Submit host application
- `getApplicationByUserId(int userId)` - Get user's application
- `getAllApplications()` - Get all applications (admin only)
- `getApplicationById(int applicationId)` - Get application details (admin only)
- `approveApplication(int applicationId, String adminNotes)` - Approve and update user role to 'host'
- `rejectApplication(int applicationId, String adminNotes)` - Reject application

---

## Entity Relationships

```
users (1) ──────< (N) listings
  │                     │
  │                     │
  │                   (1)
  │                     │
  │                     │
  │               listing_images (N)
  │
  │
  │
(1)                   (1)
  │                     │
  │                     │
  └────< (N) reservations (N) >────┘
  
  
users (1) ────< (1) host_applications
```

**Relationships:**
- One user can create many listings (1:N)
- One listing can have many images (1:N)
- One listing can have many reservations (1:N)
- One user (guest) can make many reservations (1:N)
- One user can have only ONE host application (1:1)
- Deleting a user cascades to delete their host_application
- Deleting a listing cascades to delete all its images

---

## Security Notes

1. **Password Storage**: Passwords should be hashed using bcrypt or similar before storage (currently stored as plain text - should be updated)
2. **Authorization**: All HOST operations verify ownership via DAO layer
3. **SQL Injection Prevention**: All queries use PreparedStatement with parameterized queries
4. **Cascade Deletes**: 
   - listing_images are automatically deleted when listing is removed
   - host_applications are automatically deleted when user is removed
5. **Role Validation**: Controllers check role headers before allowing operations
6. **Unique Constraints**: 
   - Email addresses must be unique (prevents duplicate accounts)
   - Each user can submit only one host application
7. **Header-Based Authentication**: System uses X-User-Id and X-User-Role headers for authentication (stateless)

---

## Database Statistics (as of latest dump)

- **Total Users**: 15+ registered users
- **Total Listings**: 33+ active listings
- **Total Reservations**: 19+ bookings
- **Total Host Applications**: 2+ applications
- **Listing Images**: 70+ uploaded images

---

## Common Queries

### Get all listings in a specific city
```sql
SELECT l.*, u.name as host_name, u.email as host_email
FROM listings l
JOIN users u ON l.user_id = u.id
WHERE l.city = 'Agadir' AND l.status = 'approved'
ORDER BY l.created_at DESC;
```

### Get all reservations for a specific host
```sql
SELECT r.*, l.title as listing_title, u.name as guest_name, u.email as guest_email
FROM reservations r
JOIN listings l ON r.listing_id = l.id
JOIN users u ON r.user_id = u.id
WHERE l.user_id = {hostId}
ORDER BY r.created_at DESC;
```

### Get pending host applications
```sql
SELECT ha.*, u.name, u.email
FROM host_applications ha
JOIN users u ON ha.user_id = u.id
WHERE ha.status = 'pending'
ORDER BY ha.created_at ASC;
```

### Get listing with all images
```sql
SELECT l.*, GROUP_CONCAT(li.image_url) as images
FROM listings l
LEFT JOIN listing_images li ON l.id = li.listing_id
WHERE l.id = {listingId}
GROUP BY l.id;
```

### Check listing availability for dates
```sql
SELECT COUNT(*) as conflicting_reservations
FROM reservations
WHERE listing_id = {listingId}
  AND status != 'cancelled'
  AND (
    (check_in <= '{requested_checkin}' AND check_out > '{requested_checkin}')
    OR (check_in < '{requested_checkout}' AND check_out >= '{requested_checkout}')
    OR (check_in >= '{requested_checkin}' AND check_out <= '{requested_checkout}')
  );
```
*If result is 0, the listing is available for those dates*

---

## Migration Notes

If migrating from an older schema:

1. **Add 'banned' role to users table**:
```sql
ALTER TABLE users MODIFY COLUMN role ENUM('guest', 'host', 'admin', 'banned') DEFAULT 'guest';
```

2. **Add new fields to listings table**:
```sql
ALTER TABLE listings 
  ADD COLUMN beds INT DEFAULT 1,
  ADD COLUMN bathrooms INT DEFAULT 1,
  ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved';
```

3. **Add new fields to reservations table**:
```sql
ALTER TABLE reservations
  ADD COLUMN guest_phone VARCHAR(20),
  ADD COLUMN guest_notes TEXT;
```

4. **Create host_applications table** (if it doesn't exist):
```sql
CREATE TABLE host_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    id_card_number VARCHAR(50) NOT NULL,
    motivation TEXT,
    experience TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_application (user_id),
    KEY idx_status (status),
    KEY idx_user_id (user_id)
);
```
