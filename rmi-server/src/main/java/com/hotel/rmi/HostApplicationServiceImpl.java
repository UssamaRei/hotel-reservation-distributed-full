package com.hotel.rmi;

import com.hotel.rmi.dao.HostApplicationDAO;
import com.hotel.rmi.dao.UserDAO;
import com.hotel.shared.model.HostApplication;
import com.hotel.shared.model.User;
import com.hotel.shared.service.HostApplicationService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class HostApplicationServiceImpl extends UnicastRemoteObject implements HostApplicationService {
    private static final Logger logger = Logger.getLogger(HostApplicationServiceImpl.class.getName());
    private final HostApplicationDAO applicationDAO;
    private final UserDAO userDAO;
    
    public HostApplicationServiceImpl() throws RemoteException {
        super();
        this.applicationDAO = new HostApplicationDAO();
        this.userDAO = new UserDAO();
    }
    
    @Override
    public HostApplication submitApplication(HostApplication application) throws RemoteException {
        try {
            logger.info("Submitting host application for user: " + application.getUserId());
            
            // Check if user already has an application
            HostApplication existing = applicationDAO.findByUserId(application.getUserId());
            if (existing != null) {
                throw new RemoteException("You have already submitted a host application");
            }
            
            // Check if user is already a host
            User user = userDAO.findById(application.getUserId());
            if (user != null && "host".equalsIgnoreCase(user.getRole())) {
                throw new RemoteException("You are already a host");
            }
            
            application.setStatus("pending");
            int id = applicationDAO.create(application);
            return applicationDAO.findById(id);
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error submitting host application", e);
            throw new RemoteException("Failed to submit application: " + e.getMessage());
        }
    }
    
    @Override
    public HostApplication getApplicationById(int id) throws RemoteException {
        try {
            return applicationDAO.findById(id);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting application by ID", e);
            throw new RemoteException("Failed to get application: " + e.getMessage());
        }
    }
    
    @Override
    public HostApplication getApplicationByUserId(int userId) throws RemoteException {
        try {
            return applicationDAO.findByUserId(userId);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting application by user ID", e);
            throw new RemoteException("Failed to get application: " + e.getMessage());
        }
    }
    
    @Override
    public List<HostApplication> getAllApplications() throws RemoteException {
        try {
            logger.info("Fetching all host applications");
            return applicationDAO.findAll();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting all applications", e);
            throw new RemoteException("Failed to get applications: " + e.getMessage());
        }
    }
    
    @Override
    public List<HostApplication> getApplicationsByStatus(String status) throws RemoteException {
        try {
            logger.info("Fetching applications with status: " + status);
            return applicationDAO.findByStatus(status);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error getting applications by status", e);
            throw new RemoteException("Failed to get applications: " + e.getMessage());
        }
    }
    
    @Override
    public boolean approveApplication(int applicationId, int adminId, String notes) throws RemoteException {
        try {
            logger.info("Approving application: " + applicationId + " by admin: " + adminId);
            
            HostApplication application = applicationDAO.findById(applicationId);
            if (application == null) {
                throw new RemoteException("Application not found");
            }
            
            // Update application status
            boolean updated = applicationDAO.updateStatus(applicationId, "approved", notes);
            if (!updated) {
                throw new RemoteException("Failed to update application status");
            }
            
            // Update user role to host
            boolean roleUpdated = userDAO.updateRole(application.getUserId(), "host");
            if (!roleUpdated) {
                throw new RemoteException("Failed to update user role");
            }
            
            logger.info("User " + application.getUserId() + " is now a host");
            return true;
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error approving application", e);
            throw new RemoteException("Failed to approve application: " + e.getMessage());
        }
    }
    
    @Override
    public boolean rejectApplication(int applicationId, int adminId, String notes) throws RemoteException {
        try {
            logger.info("Rejecting application: " + applicationId + " by admin: " + adminId);
            
            HostApplication application = applicationDAO.findById(applicationId);
            if (application == null) {
                throw new RemoteException("Application not found");
            }
            
            boolean updated = applicationDAO.updateStatus(applicationId, "rejected", notes);
            if (!updated) {
                throw new RemoteException("Failed to update application status");
            }
            
            logger.info("Application " + applicationId + " rejected");
            return true;
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error rejecting application", e);
            throw new RemoteException("Failed to reject application: " + e.getMessage());
        }
    }
}
