package com.hotel.shared.service;

import com.hotel.shared.model.HostApplication;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface HostApplicationService extends Remote {
    HostApplication submitApplication(HostApplication application) throws RemoteException;
    HostApplication getApplicationById(int id) throws RemoteException;
    HostApplication getApplicationByUserId(int userId) throws RemoteException;
    List<HostApplication> getAllApplications() throws RemoteException;
    List<HostApplication> getApplicationsByStatus(String status) throws RemoteException;
    boolean approveApplication(int applicationId, int adminId, String notes) throws RemoteException;
    boolean rejectApplication(int applicationId, int adminId, String notes) throws RemoteException;
}
