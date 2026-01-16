# Distributed Apartment Reservation System (DARS)
### Système Distribué de Réservation d'Appartements (SDRA)

[![Java](https://img.shields.io/badge/Java-11-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.13-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [User Roles](#-user-roles)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security Considerations](#-security-considerations)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

The **Distributed Apartment Reservation System** is a comprehensive web-based platform that enables property owners to list their apartments for short-term rental while allowing travelers to search, browse, and book accommodations seamlessly. Built with a modern **distributed architecture** using Java RMI (Remote Method Invocation), the system demonstrates enterprise-level software design principles with proper separation of concerns, scalability, and role-based access control.

### Context

In today's digital economy, traditional hotel booking systems are being complemented by platforms that allow individuals to rent out their personal properties. This project addresses the growing demand for peer-to-peer accommodation booking services by connecting property owners (hosts) with travelers (guests) through a centralized, moderated platform.

### Problem Statement

The project solves three main challenges:

1. **Trust & Security**: Implements a two-tier approval system (host applications + listing approvals) to ensure quality and prevent fraud.
2. **Scalability**: Uses distributed RMI architecture to separate business logic from the API layer, enabling independent scaling.
3. **Access Control**: Enforces strict role-based permissions (RBAC) to prevent unauthorized actions and data breaches.

### Objectives

- Create a secure, scalable platform for apartment rentals
- Demonstrate distributed system architecture using Java RMI
- Implement comprehensive user role management (Guest, Host, Admin)
- Provide an intuitive user interface with React and TypeScript
- Ensure data integrity through multi-layer validation

---

## ✨ Key Features

### For Guests
- ✅ Browse and search available apartments by city, title, or address
- ✅ View detailed property information (images, amenities, pricing, capacity)
- ✅ Check reserved dates before booking
- ✅ Create reservations with date selection and guest count
- ✅ Manage personal bookings (view, cancel)
- ✅ Apply to become a host with detailed application form
- ✅ Update profile and change password

### For Hosts
- ✅ Create and manage property listings
- ✅ Upload multiple property images (up to 10 per listing)
- ✅ Set pricing, capacity, amenities, and property details
- ✅ View and manage reservation requests
- ✅ Approve or reject guest bookings
- ✅ Access host dashboard with statistics
- ✅ Edit listing details and pricing

### For Admins
- ✅ Review and approve/reject host applications
- ✅ Moderate property listings before publication
- ✅ Manage all users (view, ban/unban, change roles, delete)
- ✅ View comprehensive system statistics
- ✅ Monitor all reservations and transactions
- ✅ Access detailed user and listing information
- ✅ Create new users with custom roles

---

## 🏗️ Architecture

The system implements a **three-tier distributed architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│          React 18 + TypeScript + Tailwind CSS               │
│                    (Port 5173)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST (JSON)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                           │
│              Spring Boot 2.7 REST API                        │
│                    (Port 8080)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ Java RMI
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│         Java RMI Distributed Services                        │
│                    (Port 1099)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ JDBC
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
│                  MySQL Database                              │
│                    (Port 3306)                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Components

1. **Frontend (React SPA)**: Single-page application with client-side routing, state management via Context API, and localStorage-based authentication.

2. **Spring Boot API**: RESTful API gateway that handles HTTP requests, performs authorization checks, and delegates to RMI services.

3. **RMI Server**: Distributed business logic layer with remote services for users, listings, reservations, and host applications.

4. **MySQL Database**: Relational database with normalized schema, foreign key constraints, and ENUM types for role/status management.

---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework with component architecture |
| TypeScript | 5.6.2 | Type-safe JavaScript development |
| Vite | 5.4.2 | Build tool with hot module replacement |
| React Router | 6.26.2 | Client-side routing |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| Lucide React | 0.447.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java SE | 11 | Core runtime and RMI infrastructure |
| Spring Boot | 2.7.13 | REST API framework |
| Maven | 3.6+ | Build automation and dependency management |
| MySQL Connector | 8.0.33 | JDBC driver for database connectivity |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL Server | 8.0.x | Relational database management |
| JDBC | - | Java database connectivity API |

---

## 👥 User Roles

### Guest (Invité)
A **Guest** is the default role assigned to all newly registered users. Guests can browse and search available apartment listings, view property details, and make reservations. They can also apply to become a host by submitting an application form with their personal information and motivation. Guests have basic access to the platform and can only manage their own bookings.

### Host (Hôte)
A **Host** is a property owner who has been approved by an admin to list accommodations on the platform. Hosts can create and manage their apartment listings, upload property images, set pricing, and specify amenities. They are responsible for reviewing reservation requests from guests and can approve or reject bookings for their properties. Hosts retain all guest privileges while gaining additional property management capabilities.

### Admin (Administrateur)
An **Admin** is a platform administrator with full system access and oversight responsibilities. Admins review and approve host applications, moderate property listings to ensure quality standards, and manage user accounts including the ability to ban or change user roles. They have complete visibility over all reservations, users, and listings on the platform, enabling them to enforce policies and maintain the integrity of the system.

### Role Hierarchy
```
Admin (Full Control)
  ↓
Host (Property Management + Guest Features)
  ↓
Guest (Browse & Book)
```

**Special Role**: `Banned` - Suspended accounts with no platform access

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java JDK 11 or higher**
  ```bash
  java -version
  ```

- **Apache Maven 3.6 or higher**
  ```bash
  mvn -version
  ```

- **MySQL Server 8.0 or higher**
  ```bash
  mysql --version
  ```

- **Node.js 16+ and npm** (for frontend development)
  ```bash
  node -version
  npm -version
  ```

- **Git** (optional, for cloning)
  ```bash
  git --version
  ```

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hotel-reservation-distributed-full.git
cd hotel-reservation-distributed-full
```

### 2. Database Setup

#### Create Database
```sql
CREATE DATABASE hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_db;
```

#### Run Schema Files (in order)
```bash
mysql -u root -p hotel_db < database_schema.sql
mysql -u root -p hotel_db < host_applications_schema.sql
mysql -u root -p hotel_db < add_beds_bathrooms_columns.sql
mysql -u root -p hotel_db < add_listing_status.sql
mysql -u root -p hotel_db < add_reservation_contact_fields.sql
```

#### (Optional) Insert Test Data
```bash
mysql -u root -p hotel_db < insert_test_data.sql
```

#### Configure Database Credentials
Edit `rmi-server/src/main/java/com/hotel/rmi/database/DBConnection.java`:
```java
private static final String URL = "jdbc:mysql://localhost:3306/hotel_db";
private static final String USER = "root";
private static final String PASSWORD = "your_mysql_password";
```

### 3. Build the Projects

#### Build RMI Server
```bash
cd rmi-server
mvn clean package
cd ..
```

#### Build Spring API
```bash
cd spring-api
mvn clean package
cd ..
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Running the Application

### Start All Services (Recommended Order)

#### 1. Start RMI Server (Terminal 1)
```bash
cd rmi-server
java -jar target/rmi-server-1.0-SNAPSHOT.jar
```

**Expected Output:**
```
RMI Server started successfully!
UserService bound at rmi://127.0.0.1:1099/UserService
ListingService bound at rmi://127.0.0.1:1099/ListingService
ReservationService bound at rmi://127.0.0.1:1099/ReservationService
HostApplicationService bound at rmi://127.0.0.1:1099/HostApplicationService
```

#### 2. Start Spring Boot API (Terminal 2)
```bash
cd spring-api
java -jar target/spring-api-1.0-SNAPSHOT.jar
# OR
mvn spring-boot:run
```

**Expected Output:**
```
Tomcat started on port(s): 8080 (http)
Started HotelApiApplication in X.XXX seconds
```

#### 3. Start Frontend Development Server (Terminal 3)
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE vX.X.X ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access the Application
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8080
- **RMI Registry**: localhost:1099

---

## 📁 Project Structure

```
hotel-reservation-distributed-full/
├── database_schema.sql                  # Main database schema
├── host_applications_schema.sql         # Host application table
├── add_beds_bathrooms_columns.sql      # Property details migration
├── add_listing_status.sql              # Approval workflow
├── add_reservation_contact_fields.sql  # Guest contact info
├── insert_test_data.sql                # Sample data
│
├── rmi-server/                         # Java RMI Business Logic Layer
│   ├── pom.xml
│   └── src/main/java/com/hotel/
│       ├── rmi/
│       │   ├── RMIServer.java          # Server startup
│       │   ├── UserServiceImpl.java
│       │   ├── ListingServiceImpl.java
│       │   ├── ReservationServiceImpl.java
│       │   ├── HostApplicationServiceImpl.java
│       │   └── dao/                    # Data Access Objects
│       │       ├── UserDAO.java
│       │       ├── ListingDAO.java
│       │       ├── ReservationDAO.java
│       │       └── HostApplicationDAO.java
│       └── shared/
│           ├── model/                  # Domain models
│           │   ├── User.java
│           │   ├── Listing.java
│           │   ├── Reservation.java
│           │   └── HostApplication.java
│           └── service/                # Remote interfaces
│               ├── UserService.java
│               ├── ListingService.java
│               ├── ReservationService.java
│               └── HostApplicationService.java
│
├── spring-api/                         # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/hotel/api/
│       ├── HotelApiApplication.java    # Main entry point
│       ├── config/
│       │   ├── RMIConfig.java          # RMI client setup
│       │   ├── CorsConfig.java
│       │   └── WebConfig.java          # Static file serving
│       └── controller/
│           ├── AuthController.java     # Login/Register
│           ├── UserController.java
│           ├── ListingController.java  # Public listings
│           ├── HostController.java     # Host operations
│           ├── ReservationController.java
│           ├── AdminController.java    # Admin operations
│           ├── HostApplicationController.java
│           └── FileUploadController.java
│
└── frontend/                           # React + TypeScript SPA
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx                    # App entry point
        ├── App.tsx                     # Route definitions
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   ├── HotelCard.tsx
        │   ├── ProtectedRoute.tsx
        │   └── AdminLayout.tsx
        ├── context/
        │   └── AuthContext.tsx         # Authentication state
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── HotelsPage.tsx
        │   ├── HotelDetailsPage.tsx
        │   ├── HostProfilePage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── UserProfilePage.tsx
        │   ├── MyReservationsPage.tsx
        │   ├── ReservationConfirmationPage.tsx
        │   ├── BecomeHostPage.tsx
        │   ├── BecomeHostApplicationPage.tsx
        │   ├── host/
        │   │   ├── HostListingsPage.tsx
        │   │   ├── CreateListingPage.tsx
        │   │   ├── EditListingPage.tsx
        │   │   ├── ViewListingPage.tsx
        │   │   ├── HostReservationsPage.tsx
        │   │   └── HostReservationDetailsPage.tsx
        │   └── admin/
        │       ├── DashboardPage.tsx
        │       ├── AdminUsersPage.tsx
        │       ├── AdminUserDetailsPage.tsx
        │       ├── AdminHotelsPage.tsx
        │       ├── AdminListingApprovalsPage.tsx
        │       ├── AdminListingDetailsPage.tsx
        │       ├── AdminBookingsPage.tsx
        │       ├── AdminBookingDetailsPage.tsx
        │       ├── AdminHostApplicationsPage.tsx
        │       └── AdminHostApplicationDetailPage.tsx
        └── data/
            └── mockData.ts
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with credentials | No |
| PUT | `/api/auth/users/{id}` | Update user profile | Yes (Self) |
| PUT | `/api/auth/users/{id}/password` | Change password | Yes (Self) |
| PUT | `/api/auth/users/{id}/role` | Update user role | Yes (Self) |

### Public Listing Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/listings` | Get all approved listings | No |
| GET | `/api/listings/{id}` | Get listing details | No |
| GET | `/api/listings/{id}/reservations` | Get booked dates | No |
| GET | `/api/listings/host/{hostId}` | Get host profile | No |

### Host Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/host/listings` | Get host's listings | Yes (Host) |
| POST | `/api/host/listings` | Create new listing | Yes (Host) |
| PUT | `/api/host/listings/{id}` | Update listing | Yes (Host) |
| DELETE | `/api/host/listings/{id}` | Delete listing | Yes (Host) |
| POST | `/api/host/listings/{id}/images` | Upload images | Yes (Host) |
| GET | `/api/host/reservations` | Get host reservations | Yes (Host) |
| GET | `/api/host/reservations/{id}` | Get reservation details | Yes (Host) |
| PUT | `/api/host/reservations/{id}/status` | Approve/reject | Yes (Host) |

### Reservation Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reservations` | Create reservation | Yes (Guest) |
| GET | `/api/reservations/user/{userId}` | Get user reservations | Yes (Self) |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get dashboard stats | Yes (Admin) |
| GET | `/api/admin/users` | Get all users | Yes (Admin) |
| GET | `/api/admin/users/{id}` | Get user details | Yes (Admin) |
| POST | `/api/admin/users` | Create new user | Yes (Admin) |
| PUT | `/api/admin/users/{id}/role` | Update user role | Yes (Admin) |
| PUT | `/api/admin/users/{id}/ban` | Ban user | Yes (Admin) |
| DELETE | `/api/admin/users/{id}` | Delete user | Yes (Admin) |
| GET | `/api/admin/listings` | Get all listings | Yes (Admin) |
| PUT | `/api/admin/listings/{id}/status` | Approve/reject listing | Yes (Admin) |
| DELETE | `/api/admin/listings/{id}` | Delete listing | Yes (Admin) |
| GET | `/api/admin/reservations` | Get all reservations | Yes (Admin) |
| GET | `/api/admin/host-applications` | Get applications | Yes (Admin) |
| PUT | `/api/admin/host-applications/{id}/approve` | Approve application | Yes (Admin) |
| PUT | `/api/admin/host-applications/{id}/reject` | Reject application | Yes (Admin) |

---

## 🗄️ Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('guest','host','admin','banned') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### listings
```sql
CREATE TABLE listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    address VARCHAR(255),
    price_per_night DECIMAL(10,2),
    max_guests INT,
    beds INT,
    bathrooms INT,
    amenities TEXT,
    image_url TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### reservations
```sql
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL,
    total_price DECIMAL(10,2),
    guest_phone VARCHAR(20),
    guest_notes TEXT,
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
```

#### host_applications
```sql
CREATE TABLE host_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    id_card_number VARCHAR(50),
    motivation TEXT,
    experience TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_application (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔒 Security Considerations

### ⚠️ Current Implementation (Development Mode)

This project is designed for **educational purposes** and demonstrates distributed system architecture. The following security measures are **NOT production-ready**:

1. **Plain Text Passwords** - Passwords are stored without hashing
2. **No JWT Tokens** - Uses simple header-based authentication
3. **localStorage Authentication** - Session data stored in browser
4. **No HTTPS** - HTTP-only communication
5. **No Rate Limiting** - Vulnerable to brute force attacks
6. **CORS Wide Open** - Accepts requests from any origin

### ✅ Recommended Production Enhancements

Before deploying to production, implement:

- **BCrypt/Argon2** for password hashing
- **JWT tokens** with refresh token rotation
- **HTTPS/TLS** encryption for all communications
- **Rate limiting** (e.g., Spring Security with bucket4j)
- **Input validation** and output encoding
- **CSRF protection** for state-changing operations
- **SQL injection prevention** (already using PreparedStatements)
- **Environment variables** for sensitive configuration
- **Logging and monitoring** for security events

---

## 🔧 Troubleshooting

### Common Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| `Connection refused: localhost:1099` | RMI server not running | Start RMI server first |
| `Communications link failure` | MySQL not running | Start MySQL service |
| `Email already exists` | Duplicate registration | Use different email |
| `403 Forbidden` | Wrong role/permissions | Check user role in database |
| `Images not showing` | File upload path incorrect | Check `uploads/` directory exists |
| `RemoteException: NotBoundException` | Service not registered | Restart RMI server |
| Frontend blank page | Backend not running | Start Spring API on port 8080 |
| CORS errors | Wrong API URL | Check API base URL in frontend |

### Database Connection Issues

If you see "Access denied for user":
```bash
# Reset MySQL password
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
```

Update credentials in `DBConnection.java`.

### Port Conflicts

If ports are already in use:
- **1099** (RMI): Change in `RMIServer.java` and Spring API config
- **8080** (Spring): Add `server.port=8081` in `application.properties`
- **5173** (Vite): Vite will automatically try next available port

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

- OUSSAMA SINA - (https://github.com/UssamaRei)
- MUSTAPHA OUHARMOUCH - (https://github.com/UssamaRei)
- ILYAS ATBIR - (https://github.com/UssamaRei)
- AHMED LAARIF - (https://github.com/UssamaRei)
- BRAHIM AITBENALI - (https://github.com/UssamaRei)

---

## 🙏 Acknowledgments

- Spring Boot team for excellent documentation
- React community for comprehensive tutorials
- Java RMI documentation and examples
- Tailwind CSS for the utility-first framework

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: oussamasina9@gmail.com

---

**Built with ❤️ using Java RMI, Spring Boot, and React**
