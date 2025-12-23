# Host Role Management - Quick Start Guide

## Overview
This implementation adds complete HOST role functionality to your hotel reservation system with:
- ✅ RMI services with ownership-based authorization
- ✅ Spring Boot REST API with role-based access control
- ✅ Comprehensive CRUD operations for listings
- ✅ Reservation management for hosts
- ✅ Database schema with referential integrity

---

## 🚀 Quick Start

### 1. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

# Run the schema file
SOURCE database_schema.sql;

# OR manually run these commands:
```

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('guest','host','admin') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE listing_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

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

### 2. Insert Test Data

```sql
-- Create test users
INSERT INTO users (name, email, password, role) VALUES
('John Host', 'host@example.com', 'password123', 'host'),
('Jane Guest', 'guest@example.com', 'password123', 'guest');

-- Create test listing
INSERT INTO listings (user_id, title, description, address, city, price_per_night, max_guests) VALUES
(1, 'Cozy Downtown Apartment', 'Beautiful 2-bedroom apartment', '123 Main St', 'New York', 150.00, 4);

-- Add listing image
INSERT INTO listing_images (listing_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267');

-- Create test reservation
INSERT INTO reservations (listing_id, user_id, check_in, check_out, total_price, status) VALUES
(1, 2, '2025-12-15', '2025-12-20', 750.00, 'pending');
```

### 3. Start RMI Server

```bash
cd rmi-server
mvn clean package
java -jar target/rmi-server-1.0-SNAPSHOT.jar
```

**Expected Output:**
```
RoomService bound at rmi://127.0.0.1:1099/RoomService
ListingService bound at rmi://127.0.0.1:1099/ListingService
ReservationService bound at rmi://127.0.0.1:1099/ReservationService

RMI Server started successfully!
```

### 4. Start Spring Boot API

```bash
cd spring-api
mvn spring-boot:run
```

**Expected Output:**
```
Looking up RMI service at: rmi://127.0.0.1:1099/RoomService
Looking up ListingService at: rmi://127.0.0.1:1099/ListingService
Looking up ReservationService at: rmi://127.0.0.1:1099/ReservationService
Started HotelApiApplication on port 8080
```

---

## 📋 API Endpoints

### Public Endpoints (No Authentication Required)

#### Get All Listings
```http
GET http://localhost:8080/api/listings
```

#### Get Listing by ID
```http
GET http://localhost:8080/api/listings/1
```

#### Search Listings by City
```http
GET http://localhost:8080/api/listings/search?city=New%20York
```

---

### HOST Endpoints (Requires Headers)

**Required Headers for all HOST endpoints:**
```
X-User-Id: 1
X-User-Role: host
```

#### Create Listing
```http
POST http://localhost:8080/api/host/listings
Content-Type: application/json
X-User-Id: 1
X-User-Role: host

{
  "title": "Luxury Penthouse",
  "description": "Stunning views of the city skyline",
  "address": "456 Park Ave",
  "city": "New York",
  "pricePerNight": 350.00,
  "maxGuests": 4
}
```

#### Update Listing (Only Owner)
```http
PUT http://localhost:8080/api/host/listings/1
Content-Type: application/json
X-User-Id: 1
X-User-Role: host

{
  "title": "Updated Title",
  "description": "Updated description",
  "address": "456 Park Ave",
  "city": "New York",
  "pricePerNight": 375.00,
  "maxGuests": 4
}
```

#### Delete Listing (Only Owner)
```http
DELETE http://localhost:8080/api/host/listings/1
X-User-Id: 1
X-User-Role: host
```

#### Get My Listings
```http
GET http://localhost:8080/api/host/listings
X-User-Id: 1
X-User-Role: host
```

#### Add Image to Listing
```http
POST http://localhost:8080/api/host/listings/1/images
Content-Type: application/json
X-User-Id: 1
X-User-Role: host

{
  "imageUrl": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
}
```

#### Get All My Reservations
```http
GET http://localhost:8080/api/host/reservations
X-User-Id: 1
X-User-Role: host
```

#### Get Reservations for Specific Listing
```http
GET http://localhost:8080/api/host/listings/1/reservations
X-User-Id: 1
X-User-Role: host
```

#### Update Reservation Status
```http
PATCH http://localhost:8080/api/host/reservations/1/status
Content-Type: application/json
X-User-Id: 1
X-User-Role: host

{
  "status": "confirmed"
}
```
Valid statuses: `pending`, `confirmed`, `cancelled`

---

## 🔒 Authorization Rules

### HOST Role Rules

1. **Create Listing**: ✅ Any host can create
   - System automatically sets `user_id` from header

2. **Update Listing**: ✅ Only if you own it
   - Ownership check: `listings.user_id = currentUser.id`
   - Returns `403 Forbidden` if not owner

3. **Delete Listing**: ✅ Only if you own it
   - Ownership check: `listings.user_id = currentUser.id`
   - Returns `403 Forbidden` if not owner

4. **View Reservations**: ✅ Only for your listings
   - Query joins through `listings.user_id`
   - Cannot see reservations for other hosts' listings

5. **Update Reservation Status**: ✅ Only for your listings
   - Verifies listing ownership before allowing status change

---

## 🧪 Testing with cURL

### Test Create Listing
```bash
curl -X POST http://localhost:8080/api/host/listings \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -H "X-User-Role: host" \
  -d '{
    "title": "Test Listing",
    "description": "Test Description",
    "address": "123 Test St",
    "city": "Boston",
    "pricePerNight": 100.00,
    "maxGuests": 2
  }'
```

### Test Update (Should Fail if Wrong User)
```bash
curl -X PUT http://localhost:8080/api/host/listings/1 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 999" \
  -H "X-User-Role: host" \
  -d '{
    "title": "Hacked Title",
    "pricePerNight": 1.00
  }'
```
Expected: `403 Forbidden - You do not have permission to update this listing`

### Test Get My Listings
```bash
curl http://localhost:8080/api/host/listings \
  -H "X-User-Id: 1" \
  -H "X-User-Role: host"
```

---

## 📁 Project Structure

```
hotel-reservation-distributed-full/
├── rmi-server/
│   └── src/main/java/com/hotel/
│       ├── rmi/
│       │   ├── RMIServer.java              # Registers all services
│       │   ├── RoomServiceImpl.java        # Legacy room service
│       │   ├── ListingServiceImpl.java     # NEW - Listing operations
│       │   ├── ReservationServiceImpl.java # NEW - Reservation operations
│       │   └── dao/
│       │       ├── RoomDAO.java
│       │       ├── ListingDAO.java         # NEW - Listing data access
│       │       └── ReservationDAO.java     # NEW - Reservation data access
│       └── shared/
│           ├── model/
│           │   ├── Room.java
│           │   ├── User.java               # NEW
│           │   ├── Listing.java            # NEW
│           │   └── Reservation.java        # NEW
│           ├── service/
│           │   ├── RoomService.java
│           │   ├── ListingService.java     # NEW
│           │   └── ReservationService.java # NEW
│           └── exception/
│               ├── AuthorizationException.java # NEW
│               └── NotFoundException.java      # NEW
│
├── spring-api/
│   └── src/main/java/com/hotel/
│       ├── api/
│       │   ├── controller/
│       │   │   ├── RoomController.java
│       │   │   ├── HostController.java      # NEW - Host operations
│       │   │   └── ListingController.java   # NEW - Public listing views
│       │   └── config/
│       │       └── RMIConfig.java           # UPDATED - Added new services
│       └── shared/
│           ├── model/                       # Copied from rmi-server
│           └── service/                     # Copied from rmi-server
│
├── database_schema.sql                       # NEW - Complete SQL schema
└── DATABASE_SCHEMA.md                        # NEW - Documentation
```

---

## ⚠️ Common Issues

### 1. "403 Forbidden" when updating/deleting
**Cause**: User doesn't own the listing
**Solution**: Verify `X-User-Id` header matches the listing's `user_id`

### 2. RMI Lookup Failed
**Cause**: RMI server not running
**Solution**: 
```bash
cd rmi-server
java -jar target/rmi-server-1.0-SNAPSHOT.jar
```

### 3. Foreign Key Constraint Errors
**Cause**: Tables created in wrong order
**Solution**: Drop all tables and run `database_schema.sql` again

### 4. MySQL Connection Refused
**Cause**: MySQL not running or wrong credentials
**Solution**: Check `DBConnection.java` and update:
```java
private static final String URL = "jdbc:mysql://localhost:3306/hotel_db";
private static final String USER = "root";
private static final String PASSWORD = "your_password";
```

---

## 🎯 Next Steps

1. **Authentication**: Implement JWT tokens instead of headers
2. **Validation**: Add input validation for all fields
3. **File Upload**: Implement actual image upload functionality
4. **Search**: Add advanced filtering (price range, dates, amenities)
5. **Admin Panel**: Create admin endpoints for managing all listings
6. **Frontend**: Connect React frontend to these endpoints

---

## 📚 Documentation

- **API Documentation**: See `DATABASE_SCHEMA.md` for complete API reference
- **Database Schema**: See `database_schema.sql` for table structures
- **Architecture**: RMI Server → Spring Boot API → Frontend
