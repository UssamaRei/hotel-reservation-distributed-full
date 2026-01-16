-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2026 at 05:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `host_applications`
--

CREATE TABLE `host_applications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `id_card_number` varchar(50) NOT NULL,
  `motivation` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `host_applications`
--

INSERT INTO `host_applications` (`id`, `user_id`, `phone_number`, `address`, `city`, `id_card_number`, `motivation`, `experience`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(2, 13, '+212772104770', 'hay lwahda boujdour', 'Agadir', 'sl23123', 'ae azej akzej kazej ', ' jazekj akzej aze ', 'approved', '', '2026-01-04 17:42:00', '2026-01-04 17:42:39');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `max_guests` int(11) DEFAULT 1,
  `beds` int(11) DEFAULT 1,
  `bathrooms` int(11) DEFAULT 1,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `user_id`, `title`, `description`, `address`, `city`, `price_per_night`, `max_guests`, `beds`, `bathrooms`, `status`, `created_at`) VALUES
(19, 8, 'cozy appartement', 'Welcome to our comfortable and well-located apartment.\n✨ Key Features:\n✔️ Prime Location: Just 20 min from the airport, 15 min to downtown and the beach,10min from Adrar Stadium and 2 min from a big hypermarket for shopping needs.\n✔️ Fully Equipped: Enjoy a modern, clean space with all the amenities you need.\n✔️ Fast Wi-Fi & Smart TV: Stay connected and entertained.\n✔️ Free Parking: Hassle-free parking for your car.\n✔️ Safe & Quiet Area: Ideal for families, business travelers, and vacationers.', '123 street', 'Marrakech', 20.00, 1, 1, 1, 'approved', '2026-01-04 00:02:01'),
(20, 8, 'appartement agadir', 'Sunny, quiet, cozy and well-equipped, this apartment, we hope, will have everything to please you!\n\nLiving room, kitchen, bathroom and two bedrooms with 3 beds (two single and one double) will allow you to enjoy a consistent comfort.\n\nIf the list of available and non-exhaustive equipment and specificities brings you satisfaction then we invite you to book quickly!! (subject to availability) ', 'HAY SALAM', 'Agadir', 30.00, 3, 1, 1, 'approved', '2026-01-04 00:13:14'),
(21, 8, 'appartement in Casablanca', 'Bright and spacious apartment ideal for families. \n\nEach room has a terrace. \n\nOne bedroom with double bed 160x200 + terrace 8 m², one bedroom with 2 single beds, a large living room with TV and WiFi.\n\n24/7 secure residence (cameras and guard) ', '321 STEET', 'Casablanca', 15.00, 5, 1, 1, 'approved', '2026-01-04 00:14:20'),
(22, 9, 'Cozy modern apartment', 'Very nice, well-equipped ground floor apartment 3 km from the beach ⛱️\nFeaturing a Moroccan lounge, a living room with two sofas and a TV, a bedroom with a double bed and a walk-in closet, a bathroom with walk-in shower, a well-equipped kitchen, and free parking. \nThis home is located in the lively Salam district close to restaurants and shops in a secure residence.', '123 bakkras', 'Casablanca', 30.00, 2, 1, 1, 'approved', '2026-01-04 00:16:47'),
(23, 9, 'Cozy & Convenient Apartment', 'Welcome to our comfortable and well-located apartment.\n✨ Key Features:\n✔️ Prime Location: Just 20 min from the airport, 15 min to downtown and the beach,10min from Adrar Stadium and 2 min from a big hypermarket for shopping needs.\n✔️ Fully Equipped: Enjoy a modern, clean space with all the amenities you need.\n✔️ Fast Wi-Fi & Smart TV: Stay connected and entertained.\n✔️ Free Parking: Hassle-free parking for your car.\n✔️ Safe & Quiet Area: Ideal for families, business travelers, and vacationers.', 'hay lwahda', 'Settat', 10.00, 4, 1, 1, 'approved', '2026-01-04 00:17:26'),
(24, 9, 'Spacious apartment ideal for families with terraces', 'Bright and spacious apartment ideal for families. \n\nEach room has a terrace. \n\nOne bedroom with double bed 160x200 + terrace 8 m², one bedroom with 2 single beds, a large living room with TV and WiFi.\n\n24/7 secure residence (cameras and guard) ', 'hay loodss', 'Marrakech', 40.01, 6, 1, 1, 'approved', '2026-01-04 00:19:31'),
(25, 10, 'Cozy studio with a stunning view', 'Mountain Views & Prime Location\n\nExperience comfort and simplicity in a stylish, fully equipped studio.\nEnjoy fast fiber internet, easy access to amenities, and a peaceful retreat with mountain and sunset views.\n\nIdeally set on a main road — minutes from the beach, Taghazout, and Agadir Airport — blending calm surroundings with great connectivity.', 'taghazout', 'Agadir', 50.00, 4, 1, 1, 'approved', '2026-01-04 00:20:52'),
(26, 10, 'Luxury apartment 4 in Riad Salam', 'Beautiful apartment, Air-conditioned. Composed of a bedroom + 1 living room (can be used as a bed for 3 children) + 1 dining area + 1 very well-equipped open-plan kitchen: Oven, range hood, stove top. And 1 bathroom. The apartment is 5 minutes from the souk, 5 minutes from the beach and 1/2 hour from the airport.\nThe laundry room is upstairs with a large terrace', 'Riad Salam', 'Marrakech', 60.00, 3, 1, 1, 'approved', '2026-01-04 00:21:50'),
(27, 12, 'Charming New Apartment Close to Anza Beach', 'beautiful apartment with new amenities near Anza beach (surf spot) , halfway between the beautiful beaches of Taghazoute, aghroud...and the center of Agadir ( beach, agadir oufella cable car, marina, souk el hed...)\n\nThe space\nDiscover our beautiful apartment in Anza, with new amenities and located close to Anza beach, famous for its surf breaks. Perfectly positioned between the beautiful beaches of Taghazout and Aghroud, and the lively center of Agadir.', 'Anza Beach', 'Agadir', 40.00, 4, 1, 1, 'approved', '2026-01-04 00:23:53'),
(28, 12, 'Cozy apartment with terrace in the center of Agadir bay azeaze', 'Welcome to this charming, fully independent apartment, ideal for a stay under the Agadir sun. Designed to offer comfort, tranquility and privacy, this carefully furnished accommodation welcomes you in a warm, home atmosphere.\nLocated in a quiet and safe area, the apartment enjoys a strategic location to discover Agadir and its surroundings:\n• 10 min from the Corniche\n• 8 min from Souk El Had\n• 35 min to Taghazout Beach', 'hay lhoda', 'Agadir', 29.99, 1, 0, 0, 'approved', '2026-01-04 00:24:36'),
(30, 12, 'Spacious pretty flat - 2 bedrooms+living room', 'Make yourself at home in our cosy, modern apartment in a very lively neighborhood within walking distance from restaurants, shops,  exchange offices, etc.\nThe apartment consists of one double bed bedroom, 2 single beds bedroom, a modern fully-equipped kitchen, and a sunlit living room with a smart TV. \nIt is perfect for a couple, family, and friends. The apartment is very quiet at night and is in a private and safe residence. Our apartment is on an easily accessible 1st floor with no ', '123 ADRESSE', 'Tangier', 20.00, 2, 2, 0, 'approved', '2026-01-04 15:22:26'),
(31, 12, 'Nice apartment 7 min from the beach', 'Discover this comfortable and bright modern apartment located in Nahda, Agadir. With quality amenities, thoughtful decor and a warm atmosphere, it offers an ideal setting for a pleasant stay. Spacious and well laid out, it is perfect for relaxing after a day of discovery. Whether you\'re on vacation or traveling for work, this apartment will meet your expectations. Book now for a memorable stay!\n\nThe space\nWelcome to AGADIR! 🌞', '345 addresse', 'Agadir', 30.00, 2, 3, 2, 'approved', '2026-01-04 15:26:56'),
(32, 12, 'Cozy & Convenient Apartment', 'Welcome to our comfortable and well-located apartment.\n✨ Key Features:\n✔️ Prime Location: Just 20 min from the airport, 15 min to downtown and the beach,10min from Adrar Stadium and 2 min from a big hypermarket for shopping needs.\n✔️ Fully Equipped: Enjoy a modern, clean space with all the amenities you need.\n✔️ Fast Wi-Fi & Smart TV: Stay connected and entertained.\n✔️ Free Parking: Hassle-free parking for your car.\n✔️ Safe & Quiet Area: Ideal for families, business travelers, and vacationers.', 'hay lmohmade', 'agadir', 12.00, 4, 2, 1, 'approved', '2026-01-04 15:28:41'),
(33, 12, 'Comfort & tranquility Agadir - pearl of the south af', 'This family accommodation is located in a secure residence in Hay Salam in the center of Agadir. 10 minutes to agadir beach and Alhad souk. A home close to all amenities. A first-floor apartment with two facades consisting of two bedrooms, living room, bathroom, equipped kitchen and a living room.', 'hay salam', 'Agadir', 123.00, 5, 2, 3, 'approved', '2026-01-04 15:32:02');

-- --------------------------------------------------------

--
-- Table structure for table `listing_images`
--

CREATE TABLE `listing_images` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listing_images`
--

INSERT INTO `listing_images` (`id`, `listing_id`, `image_url`) VALUES
(14, 19, 'http://localhost:8080/uploads/images/2d121fd7-24b9-4436-9225-0b5886100438.jpg'),
(15, 19, 'http://localhost:8080/uploads/images/93bb4c4c-9c51-4b8c-b833-f3c3bc21f369.jpeg'),
(16, 19, 'http://localhost:8080/uploads/images/6418f04c-f464-46b3-8756-029ac6dbda6d.jpeg'),
(17, 19, 'http://localhost:8080/uploads/images/42dc9fc9-bcb1-45ca-9bcc-193d37f257a7.jpeg'),
(18, 20, 'http://localhost:8080/uploads/images/e7c8ff28-9960-4850-882a-7105e65e3a67.jpeg'),
(19, 20, 'http://localhost:8080/uploads/images/b5fd1b95-33a7-4ae3-9b0a-6e3bc34073ec.jpeg'),
(20, 20, 'http://localhost:8080/uploads/images/d3085f30-0fbb-4bf8-ba63-5481a78f5138.jpg'),
(21, 20, 'http://localhost:8080/uploads/images/33edd199-26b2-4efd-8028-e2266122468c.jpeg'),
(22, 20, 'http://localhost:8080/uploads/images/056bf6e8-10a3-4d10-a611-c3e7a23057fd.jpeg'),
(23, 21, 'http://localhost:8080/uploads/images/71c49275-295f-4de2-a08d-53f085b8326c.jpeg'),
(24, 21, 'http://localhost:8080/uploads/images/e42fb0f1-5a91-43e0-99f7-4b987b380fbb.jpeg'),
(25, 21, 'http://localhost:8080/uploads/images/dac7df51-efdd-4f8f-9e21-84360d0937fb.jpeg'),
(26, 21, 'http://localhost:8080/uploads/images/312f81a3-a9bd-47db-be57-4ca58e992b41.jpeg'),
(27, 22, 'http://localhost:8080/uploads/images/42d18281-30be-4879-9125-8c2000d0b69c.jpeg'),
(28, 22, 'http://localhost:8080/uploads/images/781bab7d-42f0-4453-8c59-33ec5069ec23.jpg'),
(29, 22, 'http://localhost:8080/uploads/images/124d58aa-0b9d-4b07-a656-b76db3e1b785.jpeg'),
(30, 22, 'http://localhost:8080/uploads/images/67781561-6e86-48e8-9fac-84564559be82.jpeg'),
(31, 22, 'http://localhost:8080/uploads/images/ad35b585-1333-4aa5-a601-545a4895aa37.jpeg'),
(32, 23, 'http://localhost:8080/uploads/images/4757db8f-4ba7-4f4d-a2d8-5da77aa970b9.jpg'),
(33, 23, 'http://localhost:8080/uploads/images/e018d644-ac4c-4093-8d81-ad4448d8194a.jpeg'),
(34, 23, 'http://localhost:8080/uploads/images/425b66d7-25bb-4a5a-bf5a-bf09155a54a0.jpg'),
(35, 23, 'http://localhost:8080/uploads/images/e066d7a6-b816-4925-856e-b591019d33fd.jpg'),
(36, 23, 'http://localhost:8080/uploads/images/00bdda76-5200-4d26-bb42-81b4fa7c3857.jpeg'),
(37, 24, 'http://localhost:8080/uploads/images/81859d14-153c-4d8c-b416-6c9fb25b3c6f.jpeg'),
(38, 24, 'http://localhost:8080/uploads/images/71edb94f-ba1f-45fb-91a2-24d47ee648da.jpeg'),
(39, 24, 'http://localhost:8080/uploads/images/2b18ab1b-ba44-4f64-97bc-4971e57fc6fc.jpeg'),
(40, 24, 'http://localhost:8080/uploads/images/7ca7389d-6909-4c59-9637-198eca996f41.jpeg'),
(41, 24, 'http://localhost:8080/uploads/images/c39f18a4-71d6-422f-8fd0-a197997598cd.jpeg'),
(42, 24, 'http://localhost:8080/uploads/images/754cd55f-d60b-445b-afa0-ff567a859695.jpeg'),
(43, 25, 'http://localhost:8080/uploads/images/d16e4c18-cdd3-4b75-8924-28f372694419.jpeg'),
(44, 25, 'http://localhost:8080/uploads/images/4c779caf-ad99-4c67-93c8-11149f329a2a.jpeg'),
(45, 25, 'http://localhost:8080/uploads/images/fdfd91eb-40a0-4ecd-9e82-4801c22b0049.jpeg'),
(46, 25, 'http://localhost:8080/uploads/images/c39f254e-8d10-4d11-a65d-a974ab2fafe4.jpeg'),
(47, 25, 'http://localhost:8080/uploads/images/c04a7481-5e4c-4879-9bf7-dfeb18cac87a.jpeg'),
(48, 26, 'http://localhost:8080/uploads/images/0592780f-9ab9-47a6-aca4-99e382076388.jpeg'),
(49, 26, 'http://localhost:8080/uploads/images/f141560b-c60c-45d1-a67e-849e787f7e9b.jpeg'),
(50, 26, 'http://localhost:8080/uploads/images/d1f26780-cee0-4536-aafb-f933c5ac8af7.jpeg'),
(51, 26, 'http://localhost:8080/uploads/images/72aaf801-c882-4140-bfc1-b2ceb7d9cf97.jpeg'),
(52, 26, 'http://localhost:8080/uploads/images/af5a4e05-66d1-4572-a5cc-a5302d808d8c.jpeg'),
(53, 27, 'http://localhost:8080/uploads/images/dbc3b7b5-7859-46e4-8d2d-ad06bb9450fc.jpg'),
(54, 27, 'http://localhost:8080/uploads/images/75e641c1-28b7-44e7-b666-a20cbdfd13d4.jpeg'),
(55, 27, 'http://localhost:8080/uploads/images/fdf30213-d4bb-4041-99e3-c619cb09fe2d.jpeg'),
(56, 27, 'http://localhost:8080/uploads/images/46948c6d-0b97-4f80-a5bd-a0a3ad96ea7a.jpeg'),
(57, 27, 'http://localhost:8080/uploads/images/17ab8af7-b77d-4713-abb7-5335c9553ad5.jpeg'),
(58, 27, 'http://localhost:8080/uploads/images/704e487e-58e5-44df-8485-c022822c53ec.jpeg'),
(59, 28, 'http://localhost:8080/uploads/images/628a417e-dd53-4263-842c-09d25309ba7e.jpeg'),
(60, 28, 'http://localhost:8080/uploads/images/ea2fcbac-4c09-4737-95b7-a30d340ac929.jpeg'),
(61, 28, 'http://localhost:8080/uploads/images/3313ef1c-ec2f-4688-8e47-becac8bf2067.jpeg'),
(62, 28, 'http://localhost:8080/uploads/images/90518c98-ae1c-4fc8-9a03-3b272971e352.jpeg'),
(64, 30, 'http://localhost:8080/uploads/images/d6d1b97d-d76e-4a00-9d04-0980df5758fc.jpg'),
(65, 30, 'http://localhost:8080/uploads/images/34bb6d8f-9f70-4aab-9e69-6c0ba82c7b53.jpeg'),
(66, 30, 'http://localhost:8080/uploads/images/a5deb8b8-b7df-4849-9a9d-914263c5d72b.jpeg'),
(67, 30, 'http://localhost:8080/uploads/images/63cf0228-ab47-4405-915c-b28a0cbe9969.jpeg'),
(68, 31, 'http://localhost:8080/uploads/images/e57dac1f-3e3d-40e9-a695-c6859278bd58.jpg'),
(69, 32, 'http://localhost:8080/uploads/images/6eb33f96-71c4-4b46-b623-d1ba00bd9d07.jpeg'),
(70, 33, 'http://localhost:8080/uploads/images/3eed46b8-61f2-46c5-be15-4d6e6913842b.jpeg'),
(71, 33, 'http://localhost:8080/uploads/images/4987b327-7b64-4320-95ae-7a99f24d80c3.jpeg'),
(72, 33, 'http://localhost:8080/uploads/images/a8a5e232-472e-4801-9910-c068625cb89a.jpeg'),
(73, 33, 'http://localhost:8080/uploads/images/d1e097e2-e0f2-4158-8815-7494b61c2018.jpeg'),
(74, 32, 'http://localhost:8080/uploads/images/c8229349-9391-4235-bbca-6ac3a8ca9aed.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `guest_phone` varchar(20) DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `guest_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `listing_id`, `user_id`, `guest_phone`, `check_in`, `check_out`, `total_price`, `status`, `guest_notes`, `created_at`) VALUES
(15, 33, 13, '0623748123', '2026-01-05', '2026-01-07', 246.00, 'confirmed', ' azeaze aze azesqfdfg ', '2026-01-04 18:10:07'),
(16, 27, 13, '073842346', '2026-01-05', '2026-01-08', 120.00, 'pending', 'lorem', '2026-01-04 18:54:52'),
(17, 33, 15, '23423423242', '2026-01-07', '2026-01-09', 246.00, 'cancelled', 'zerza ze aze aze ', '2026-01-04 18:56:22'),
(18, 28, 15, '0772104770', '2026-01-06', '2026-01-08', 59.98, 'confirmed', 'nothing', '2026-01-04 22:30:22'),
(19, 33, 15, '64654656', '2026-01-27', '2026-02-05', 1107.00, 'confirmed', 'ggfcjg hjg ', '2026-01-11 17:41:26');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('guest','host','admin','banned') DEFAULT 'guest',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Test Admin', 'admin@example.com', 'admin123', 'admin', '2025-12-08 19:01:06'),
(8, 'OUSSAMA SINA', 'oussamasina9@gmail.com', 'oussama2004', 'host', '2026-01-03 23:19:56'),
(9, 'OUHARMOUCH MUSTAPAHA', 'mustapha@gmail.com', 'mustapha2004', 'host', '2026-01-03 23:20:52'),
(10, 'ILYAS ATBIR', 'ilyas@gmail.com', 'ilyas2004', 'host', '2026-01-03 23:21:59'),
(11, 'AHMED LAARIF', 'ahmed@gmail.com', 'ahmed2004', 'guest', '2026-01-03 23:22:35'),
(12, 'AYOUB SINA', 'ayoub@gmail.com', 'ayoub2004', 'host', '2026-01-03 23:23:10'),
(13, 'NOURDINE damn', 'nourdine@gmail.com', 'nourdine2004', 'host', '2026-01-03 23:23:47'),
(14, 'LAARBI DAKA', 'larbi@gmail.com', 'larbi2004', 'guest', '2026-01-03 23:24:23'),
(15, 'jhon', 'jhon@example.com', 'jhon2004', 'guest', '2026-01-04 18:19:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `host_applications`
--
ALTER TABLE `host_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_application` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `listing_images`
--
ALTER TABLE `listing_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `host_applications`
--
ALTER TABLE `host_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `listing_images`
--
ALTER TABLE `listing_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `host_applications`
--
ALTER TABLE `host_applications`
  ADD CONSTRAINT `host_applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `listing_images`
--
ALTER TABLE `listing_images`
  ADD CONSTRAINT `listing_images_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
