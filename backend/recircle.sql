-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 06, 2025 at 04:20 AM
-- Server version: 9.1.0
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recircle`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
CREATE TABLE IF NOT EXISTS `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_cartitems_cart` (`cart_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Clothing', 'Pre-owned clothing items', '2025-09-06 04:20:38'),
(2, 'Electronics', 'Used electronic devices and accessories', '2025-09-06 04:20:38'),
(3, 'Furniture', 'Second-hand furniture and home decor', '2025-09-06 04:20:38'),
(4, 'Books', 'Used books and educational materials', '2025-09-06 04:20:38'),
(5, 'Toys & Games', 'Pre-owned toys and games', '2025-09-06 04:20:38'),
(6, 'Sports & Outdoors', 'Sporting goods and outdoor equipment', '2025-09-06 04:20:38'),
(7, 'Home & Garden', 'Home and garden items', '2025-09-06 04:20:38'),
(8, 'Jewelry & Accessories', 'Pre-owned jewelry and fashion accessories', '2025-09-06 04:20:38'),
(9, 'Automotive', 'Automotive parts and accessories', '2025-09-06 04:20:38'),
(10, 'Other', 'Miscellaneous items', '2025-09-06 04:20:38');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
CREATE TABLE IF NOT EXISTS `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_orders_buyer` (`buyer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productimages`
--

DROP TABLE IF EXISTS `productimages`;
CREATE TABLE IF NOT EXISTS `productimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_productimages_product` (`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `status` enum('available','sold','pending') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_seller` (`seller_id`),
  KEY `idx_products_status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(210) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
