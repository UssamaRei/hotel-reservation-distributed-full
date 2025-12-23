-- Insert test users
INSERT INTO users (name, email, password, role) VALUES 
('Test Host', 'host@example.com', 'password123', 'host'),
('Test Admin', 'admin@example.com', 'admin123', 'admin'),
('Test Guest', 'guest@example.com', 'guest123', 'guest');

-- Show inserted users
SELECT id, name, email, role FROM users;
