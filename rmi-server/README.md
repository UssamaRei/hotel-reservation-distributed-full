RMI Server (in-memory)
---------------------
Build:
    mvn -f rmi-server clean package
Run:
    java -cp rmi-server/target/rmi-server-1.0-SNAPSHOT.jar com.hotel.rmi.RMIServer [rmi-host-ip]
Example:
    java -cp rmi-server/target/rmi-server-1.0-SNAPSHOT.jar com.hotel.rmi.RMIServer 192.168.1.10
Notes:
    - Default host is 127.0.0.1
    - If running on different machine, pass the machine IP as the first argument.
