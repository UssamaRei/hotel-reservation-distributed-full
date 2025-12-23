# Hotel Reservation Database Schema

## Database: `hotel_db`

This database supports an Airbnb-like hotel reservation system with role-based access control.

---

## Tables

### 1. users
Stores user information with role-based access (guest, host, admin).

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('guest','host','admin') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

---

### 2. listings
Stores property listings created by hosts.

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `user_id` → `users(id)`
- Recommended: INDEX on `user_id` for host queries
- Recommended: INDEX on `city` for search queries

---

### 3. listing_images
Stores image URLs for listings.

```sql
CREATE TABLE listing_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
```

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `listing_id` → `listings(id)`
- CASCADE DELETE: Images are deleted when listing is deleted

---

### 4. reservations
Stores booking reservations made by guests.

```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    user_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `listing_id` → `listings(id)`
- FOREIGN KEY on `user_id` → `users(id)`
- Recommended: INDEX on `listing_id` for host reservation queries

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

---

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
INSERT INTO listings (user_id, title, description, address, city, price_per_night, max_guests) VALUES
(1, 'Cozy Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of the city', '123 Main St', 'New York', 150.00, 4),
(1, 'Beach House Paradise', 'Stunning beachfront property with ocean views', '456 Ocean Dr', 'Miami', 250.00, 6);
```

### Insert Sample Images
```sql
INSERT INTO listing_images (listing_id, image_url) VALUES
(1, 'https://example.com/images/apt1.jpg'),
(1, 'https://example.com/images/apt2.jpg'),
(2, 'https://example.com/images/beach1.jpg');
```

### Insert Sample Reservations
```sql
INSERT INTO reservations (listing_id, user_id, check_in, check_out, total_price, status) VALUES
(1, 2, '2025-12-15', '2025-12-20', 750.00, 'confirmed'),
(2, 2, '2025-12-25', '2025-12-30', 1250.00, 'pending');
```

---

## API Endpoints

### Public Endpoints (Guest Access)
- `GET /api/listings` - Get all listings
- `GET /api/listings/{id}` - Get listing details
- `GET /api/listings/search?city={city}` - Search listings by city

### Host Endpoints (Requires: role=host)
- `POST /api/host/listings` - Create listing (sets user_id from header)
- `PUT /api/host/listings/{id}` - Update listing (ownership verified)
- `DELETE /api/host/listings/{id}` - Delete listing (ownership verified)
- `GET /api/host/listings` - Get host's listings
- `GET /api/host/listings/{id}` - Get specific listing (ownership verified)
- `POST /api/host/listings/{id}/images` - Add image (ownership verified)
- `GET /api/host/reservations` - Get all reservations for host's listings
- `GET /api/host/listings/{id}/reservations` - Get reservations for specific listing
- `PATCH /api/host/reservations/{id}/status` - Update reservation status

### Required Headers for Host Endpoints
```
X-User-Id: {userId}
X-User-Role: host
```

---

## Database Setup Commands

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hotel_db;"

# Run schema
mysql -u root -p hotel_db < database_schema.sql

# Grant permissions
mysql -u root -p -e "GRANT ALL PRIVILEGES ON hotel_db.* TO 'hotel_user'@'localhost';"
```

---

## RMI Services

### ListingService
- `createListing(Listing)`
- `updateListing(Listing, int currentUserId)` - Throws AuthorizationException
- `deleteListing(int listingId, int currentUserId)` - Throws AuthorizationException
- `getListingsByHost(int hostId)`
- `getListingById(int listingId)`
- `getAllListings()`
- `addListingImage(int listingId, String imageUrl, int currentUserId)` - Throws AuthorizationException

### ReservationService
- `getReservationsByHost(int hostId)`
- `getReservationsByListing(int listingId, int currentUserId)` - Throws AuthorizationException
- `getReservationById(int reservationId)`
- `createReservation(Reservation)`
- `updateReservationStatus(int reservationId, String newStatus, int currentUserId)` - Throws AuthorizationException

---

## Security Notes

1. **Password Storage**: Passwords should be hashed using bcrypt or similar before storage
2. **Authorization**: All HOST operations verify ownership via DAO layer
3. **SQL Injection**: All queries use PreparedStatement with parameterized queries
4. **Cascade Deletes**: listing_images are automatically deleted when listing is removed
5. **Role Validation**: Controllers check role headers before allowing operations
