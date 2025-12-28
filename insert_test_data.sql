-- Insert test users with specific IDs for demo authentication
-- Note: These match the IDs used in the frontend AuthContext mock login
INSERT INTO users (id, name, email, password, role) VALUES 
(1, 'Admin User', 'admin@example.com', 'admin123', 'admin'),
(2, 'Host User', 'host@example.com', 'password123', 'host'),
(3, 'Host User 2', 'host3@example.com', 'password123', 'host'),
(4, 'Host User 3', 'host4@example.com', 'password123', 'host'),
(5, 'Guest User', 'guest@example.com', 'guest123', 'guest');

-- Show inserted users
SELECT id, name, email, role FROM users;
