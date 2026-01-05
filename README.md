Hotel Reservation Distributed System
===================================

Overview
--------
This project is a minimal distributed hotel room management system demonstrating: 
- A Java RMI server (`rmi-server`) exposing a remote `RoomService`.
- A Spring Boot REST API (`spring-api`) acting as a client to the RMI service and translating RMI calls into HTTP endpoints.
- A lightweight HTML/JavaScript frontend (`frontend`) consuming the REST API for CRUD operations on rooms.
- **JWT-based authentication system** for secure access to the API endpoints.

Authentication
--------------
The system now includes JWT-based authentication. See [AUTHENTICATION.md](AUTHENTICATION.md) for detailed information.

Default login credentials:
- Admin: username=`admin`, password=`admin123`
- User: username=`user`, password=`user123`

Current Persistence Mode
------------------------
The `rmi-server` module now uses MySQL via simple JDBC/DAO (table `rooms`). If the database or table does not exist, calls will throw `RemoteException` wrapping JDBC errors. Follow the MySQL setup below before starting the server, or adapt `DBConnection.java` for a different DB.

Module Structure
----------------
```
rmi-server/
  src/main/java/com/hotel/shared/model/Room.java
  src/main/java/com/hotel/shared/service/RoomService.java
  src/main/java/com/hotel/rmi/RoomServiceImpl.java   (delegates to RoomDAO)
  src/main/java/com/hotel/rmi/dao/RoomDAO.java       (JDBC CRUD)
  src/main/java/com/hotel/rmi/database/DBConnection.java
spring-api/
  src/main/java/com/hotel/api/controller/RoomController.java (HTTP endpoints)
  src/main/java/com/hotel/api/config/RMIConfig.java          (lookup RMI)
frontend/
  index.html, js/room.js, css/style.css
```

Prerequisites
-------------
- Java 11+ (JDK) and Maven 3.6+
- MySQL Server 8.x (or compatible) running locally (default config expects host `localhost`, port `3306`).
- A browser for the frontend.

MySQL Setup
-----------
1. Start MySQL locally and create the database:
   ```sql
   CREATE DATABASE hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Create the `rooms` table:
   ```sql
   USE hotel_db;
   CREATE TABLE rooms (
       id INT AUTO_INCREMENT PRIMARY KEY,
       type VARCHAR(50) NOT NULL,
       price DECIMAL(10,2) NOT NULL
   );
   ```
3. (Optional) Insert sample data:
   ```sql
   INSERT INTO rooms(type, price) VALUES ('Single', 50.00), ('Double', 80.00), ('Suite', 150.00);
   ```
4. Update credentials in `rmi-server/src/main/java/com/hotel/rmi/database/DBConnection.java` if your MySQL user/password differ.

Quick Start (Single Machine)
----------------------------
Run everything on `127.0.0.1`:
```bash
# 1. Build RMI server (shaded JAR includes MySQL driver)
mvn -f rmi-server clean package

# 2. Start the RMI server (optionally pass host IP)
java -cp rmi-server/target/rmi-server-1.0-SNAPSHOT.jar com.hotel.rmi.RMIServer

# 3. Start Spring Boot API (separate terminal)
mvn -f spring-api spring-boot:run
```
Open `frontend/index.html` in your browser and click "Reload" to fetch rooms.

Configuration
-------------
Spring API resolves the RMI endpoint using `rmi.host` in `spring-api/src/main/resources/application.properties`.
Default:
```
rmi.host=127.0.0.1
```
Change it when deploying across machines.

Distributed Run (Multiple Machines)
----------------------------------
1. Pick a machine for the RMI server; ensure port `1099` is reachable (open firewall if needed).
2. Start RMI server with its external IP:
   ```bash
   java -jar rmi-server/target/rmi-server-1.0-SNAPSHOT-shaded.jar <server-ip>
   ```
3. On the Spring Boot machine, set `rmi.host=<server-ip>` in `application.properties`, then run:
   ```bash
   mvn -f spring-api spring-boot:run
   ```
4. Open the frontend on any machine pointing to the Spring Boot host (adjust `API` constant in `frontend/js/room.js` if not `http://localhost:8080`).

Troubleshooting
---------------
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `DB Error (getAllRooms): com.mysql.cj.jdbc.Driver` | Driver not found / build not shaded | Rebuild with `mvn -f rmi-server clean package` and run shaded JAR. |
| `Communications link failure` | MySQL not running / wrong credentials | Verify MySQL service and credentials in `DBConnection`. |
| `ConnectException: Connection refused to host` | RMI host/IP mismatch or port blocked | Pass correct host when starting server; open port 1099. |
| Empty room list | No rows in table | Insert sample data or create rooms via frontend. |

Extending the Project
---------------------
- Add reservation module similar to rooms (new DAO + service interface).
- Introduce connection pooling (HikariCP) instead of raw DriverManager.
- Replace manual JDBC with JPA/Hibernate if richer ORM features are needed.
- Add authentication layer (JWT) to the Spring API.
- Containerize services with Docker and use Docker Compose for local orchestration.

License / Usage
---------------
Educational/demo use. Adapt freely for your school project.

Contributors
------------
Feel free to add your names here.

---
If you need another section (Docker, tests, reservations), ask and it can be added.
