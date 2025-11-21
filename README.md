Hotel Reservation Distributed - Ready project
=============================================
This archive contains a runnable minimal distributed system:
- rmi-server : Java RMI server (in-memory storage)
- spring-api : Spring Boot REST API that acts as RMI client (calls the RMI server)
- frontend   : Simple HTML + JS frontend that calls the Spring Boot API

Quick run (all on the same machine):
1) Build rmi-server:
   mvn -f rmi-server clean package
2) Run RMI server (default host 127.0.0.1):
   java -cp rmi-server/target/rmi-server-1.0-SNAPSHOT.jar com.hotel.rmi.RMIServer
3) Build & run Spring Boot:
   mvn -f spring-api spring-boot:run
4) Open frontend/index.html in browser and click 'Load rooms'

Running across machines:
 - Ensure firewall/ports allow access to port 1099 on the RMI server.
 - Run RMI server with the server's IP:
     java -cp rmi-server/target/rmi-server-1.0-SNAPSHOT.jar com.hotel.rmi.RMIServer 192.168.x.y
 - Edit spring-api/src/main/resources/application.properties and set rmi.host=192.168.x.y
 - Start Spring Boot on another machine and open frontend pointing to Spring Boot host.

Notes:
 - This minimal example uses in-memory storage (no database) making it easy to run for demo.
 - If you want MySQL persistence, tell me and I'll add it.
