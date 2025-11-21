Spring Boot API (RMI client)
---------------------------
Build:
    mvn -f spring-api clean package
Run (default looks up RMI at 127.0.0.1):
    mvn -f spring-api spring-boot:run
Or run packaged jar:
    java -jar spring-api/target/spring-api-1.0-SNAPSHOT.jar
To connect to remote RMI server:
    edit spring-api/src/main/resources/application.properties and set rmi.host to the RMI server IP.
