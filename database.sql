SET NAMES utf8mb4;
--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `image_desktop` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `image_mobile` varchar(500) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `promotion_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image_desktop`, `image_mobile`, `promotion_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Banner 99', '/uploads/banners/banner-1766914991159-575871519.jpg', '/uploads/banners/banner-1766914991160-663694937.jpg', 5, 1, '2025-12-27 16:35:19', '2025-12-28 09:58:21'),
(2, 'Banner 1 tặng 4', '/uploads/banners/banner-1766914981126-433149210.jpg', '/uploads/banners/banner-1766914981126-572772611.jpg', 2, 1, '2025-12-27 16:35:54', '2025-12-28 09:58:01'),
(3, 'Banner Đỏ', '/uploads/banners/banner-1766914970010-597597800.jpg', '/uploads/banners/banner-1766914970010-106962801.jpg', 4, 1, '2025-12-27 16:36:25', '2025-12-28 09:57:56'),
(4, '1 tặng 1', '/uploads/banners/banner-1766914956502-716571436.png', '/uploads/banners/banner-1766914956524-505538867.jpg', 6, 1, '2025-12-28 07:13:28', '2025-12-28 09:57:50');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 3, '2025-12-28 07:00:25', '2025-12-28 07:00:25'),
(3, 5, '2025-12-28 17:03:57', '2025-12-28 17:03:57'),
(4, 7, '2025-12-28 20:05:24', '2025-12-28 20:05:24');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `options` json DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `cart_item_id` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `is_active`, `created_at`) VALUES
(1, 'Ưu đãi hôm nay', 'uu-dai-hom-nay', '/uploads/categories/cat-1766819337348-693740448.png', 1, '2025-12-27 06:16:46'),
(2, 'Best Seller', 'best-seller', '/uploads/categories/cat-1766819314695-754680146.png', 1, '2025-12-27 06:16:54'),
(3, 'Món mới', 'mon-moi', '/uploads/categories/cat-1766819361499-470207815.png', 1, '2025-12-27 07:09:21'),
(4, 'Gà Giòn', 'ga-gion', '/uploads/categories/cat-1766819376694-547221216.png', 1, '2025-12-27 07:09:36'),
(5, 'Thức uống', 'thuc-uong', '/uploads/categories/cat-1766819396235-875486979.png', 1, '2025-12-27 07:09:56'),
(6, 'Burger', 'burger', '/uploads/categories/cat-1766819425461-699062094.png', 1, '2025-12-27 07:10:25'),
(7, 'Mỳ ý và cơm', 'my-y-va-com', '/uploads/categories/cat-1766912277109-723486404.png', 1, '2025-12-28 08:57:57'),
(8, 'Món ăn kèm', 'mon-an-kem', '/uploads/categories/cat-1766944588188-407135817.png', 1, '2025-12-28 17:56:28'),
(9, 'Combo', 'combo', '/uploads/categories/cat-1766948126764-962056025.png', 1, '2025-12-28 18:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `discount_type` enum('percent','fixed') COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) DEFAULT '0.00',
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `usage_limit` int DEFAULT '0',
  `usage_count` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_value`, `max_discount_amount`, `start_date`, `end_date`, `usage_limit`, `usage_count`, `is_active`, `created_at`, `updated_at`) VALUES
(5, 'CRISPC10', 'CRISPC10 ', 'fixed', 10000.00, 60000.00, 0.00, '2025-12-28 17:51:00', '2025-12-31 17:51:00', 10, 0, 1, '2025-12-28 10:52:01', '2025-12-28 10:52:01'),
(6, 'CRISPC20', 'CRISPC20', 'fixed', 20000.00, 110000.00, 0.00, '2025-12-28 17:52:00', '2025-12-31 17:52:00', 10, 0, 1, '2025-12-28 10:52:39', '2025-12-28 10:52:39'),
(7, 'CRISPC35', 'CRISPC35 ', 'fixed', 35000.00, 180000.00, 0.00, '2025-12-28 17:52:00', '2025-12-31 17:52:00', 10, 0, 1, '2025-12-28 10:53:04', '2025-12-28 10:53:04'),
(8, 'CRISPC90', 'CRISPC90', 'fixed', 90000.00, 350000.00, 0.00, '2025-12-28 17:53:00', '2025-12-31 17:53:00', 10, 0, 1, '2025-12-28 10:53:30', '2025-12-28 10:53:30');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `address` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `note` text COLLATE utf8mb4_vietnamese_ci,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT 'cod',
  `status` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `coupon_code` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `full_name`, `phone_number`, `address`, `note`, `subtotal`, `shipping_fee`, `discount_amount`, `total`, `payment_method`, `status`, `coupon_code`, `created_at`, `updated_at`) VALUES
('ORD05656C243BAC4A9EAFA69EDF00C80816', 5, 'Nguyễn Trần Lâm', '0706708023', 'Hoàn Kiếm, Phuoc Hoa, Nha Trang, Khánh Hòa Province, 57124, Vietnam', '', 1051000.00, 20000.00, 0.00, 1071000.00, 'qrcode', 'completed', NULL, '2025-12-28 17:24:32', '2025-12-28 18:24:38'),
('ORD0D7D377A1CEC47E78798E7B905032104', NULL, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '123', 329000.00, 20000.00, 0.00, 349000.00, 'cod', 'pending', NULL, '2025-12-28 20:06:14', '2025-12-28 20:06:14'),
('ORD173A5002702E4519B5B1C807E7388676', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '123', 110000.00, 20000.00, 0.00, 130000.00, 'cod', 'pending', NULL, '2025-12-28 10:18:05', '2025-12-28 10:18:05'),
('ORD223DE25F71FD48A2AAF2CEB8F81D6228', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '123', 139000.00, 20000.00, 0.00, 159000.00, 'qrcode', 'pending', NULL, '2025-12-28 10:23:54', '2025-12-28 10:23:54'),
('ORD5A976802062E4034AD9124C7A6DC9E09', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '123', 45000.00, 20000.00, 0.00, 65000.00, 'qrcode', 'pending', NULL, '2025-12-28 10:26:37', '2025-12-28 10:26:37'),
('ORD62342A5C87C1417ABBA67D22D28BC97D', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '', 69000.00, 20000.00, 0.00, 89000.00, 'qrcode', 'pending', NULL, '2025-12-28 10:32:22', '2025-12-28 10:32:22'),
('ORD96E77F321D654683A6BD23FDFA510617', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '', 110000.00, 20000.00, 0.00, 130000.00, 'qrcode', 'completed', NULL, '2025-12-28 10:27:12', '2025-12-28 18:25:18'),
('ORD9C3C84FC38174D1EB580874024C9E91B', NULL, 'Nguyễn Nghĩa Mạnh', '0706708024', 'Man Thiện, Phường Phú Mỹ, Ho Chi Minh City, 78706, Vietnam', 'Giao nhanh cho tôi', 667000.00, 20000.00, 20000.00, 667000.00, 'cod', 'completed', 'CRISPC20', '2025-12-28 16:49:34', '2025-12-28 16:52:35'),
('ORD9D38C119A8E848FFB89D0899B83FECA0', 7, 'Cao Ngọc Quý', '0914953685', 'District 1, Thủ Đức, Ho Chi Minh City, Vietnam', '', 683000.00, 20000.00, 0.00, 703000.00, 'cod', 'completed', NULL, '2025-12-28 20:07:41', '2025-12-28 20:08:45'),
('ORDA4D167581C754A4CBFCC3A30BB5C5E67', 5, 'Nguyễn Trần Lâm', '0706708023', 'Man Thiện, Phường Phú Mỹ, Ho Chi Minh City, 78706, Vietnam', 'Làm ko cay, giao trễ quá không lấy', 1297000.00, 20000.00, 0.00, 2100.00, 'banking', 'processing', NULL, '2025-12-28 17:06:53', '2025-12-28 17:09:46'),
('ORDBA98120448064F18AEB0697C17D68288', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '', 110000.00, 20000.00, 0.00, 130000.00, 'momo', 'pending', NULL, '2025-12-28 10:21:07', '2025-12-28 10:21:07'),
('ORDC46534CDB2B14BC196D104A45ECCA0DB', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '', 99000.00, 20000.00, 0.00, 119000.00, 'qrcode', 'completed', NULL, '2025-12-28 10:33:22', '2025-12-28 11:30:02'),
('ORDD5C9792519FD4D93903FEBABC03AAFD5', 7, 'Cao Ngọc Quý', '0914953685', 'District 1, Thủ Đức, Ho Chi Minh City, Vietnam', '', 29813000.00, 20000.00, 0.00, 29833000.00, 'cod', 'completed', NULL, '2025-12-28 20:07:07', '2025-12-28 20:08:17'),
('ORDDC80538A916146F99B9949FC415DFEB2', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '', 89000.00, 20000.00, 0.00, 5000.00, 'banking', 'cancelled', NULL, '2025-12-28 10:33:43', '2025-12-28 10:46:19'),
('ORDDF6F72B602DB49A7BBE5C3B25CC3857E', 3, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '123', 79000.00, 20000.00, 0.00, 99000.00, 'qrcode', 'pending', NULL, '2025-12-28 10:30:43', '2025-12-28 10:30:43'),
('ORDE6CDB924B3C94AE5BADB013E2BFAF46A', NULL, 'Bùi Văn Minh', '0972750142', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', '12313', 369000.00, 20000.00, 0.00, 389000.00, 'cod', 'pending', NULL, '2025-12-28 19:43:50', '2025-12-28 19:43:50'),
('ORDF6857E05933F451FB90534C2DFB2F80D', 3, 'Bùi Văn Minh', '0972750142', 'District 1, Thủ Đức, Ho Chi Minh City, Vietnam', '', 22121000.00, 20000.00, 0.00, 22141000.00, 'cod', 'completed', NULL, '2025-12-28 19:42:07', '2025-12-28 19:42:49');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` varchar(50) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `options` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `quantity`, `unit_price`, `total_price`, `options`) VALUES
(15, 'ORD173A5002702E4519B5B1C807E7388676', 38, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', '/uploads/products/prod-1766915212187-314182857.png', 1, 110000.00, 110000.00, '{}'),
(16, 'ORDBA98120448064F18AEB0697C17D68288', 38, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', 'http://localhost:4000/uploads/products/prod-1766915212187-314182857.png', 1, 110000.00, 110000.00, '{}'),
(17, 'ORD223DE25F71FD48A2AAF2CEB8F81D6228', 35, 'Combo Mì Ý 2 (Alacarte)', 'http://localhost:4000/uploads/products/prod-1766912465301-784598358.png', 1, 139000.00, 139000.00, '{\"Chọn loại gà\": \"Gà không cay\"}'),
(18, 'ORD5A976802062E4034AD9124C7A6DC9E09', 34, 'Cơm BBQ gà không xương (Alacarte)', 'http://localhost:4000/uploads/products/prod-1766912416547-953261154.png', 1, 45000.00, 45000.00, '{}'),
(19, 'ORD96E77F321D654683A6BD23FDFA510617', 38, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', 'http://localhost:4000/uploads/products/prod-1766915212187-314182857.png', 1, 110000.00, 110000.00, '{}'),
(20, 'ORDDF6F72B602DB49A7BBE5C3B25CC3857E', 33, 'Combo Mì Ý 1 (Alacarte)', 'http://localhost:4000/uploads/products/prod-1766912397483-175154420.png', 1, 79000.00, 79000.00, '{}'),
(21, 'ORD62342A5C87C1417ABBA67D22D28BC97D', 32, 'Mì Ý Phô Mai Donut Tôm (Alacarte)', 'http://localhost:4000/uploads/products/prod-1766912375111-985119380.png', 1, 69000.00, 69000.00, '{}'),
(22, 'ORDC46534CDB2B14BC196D104A45ECCA0DB', 19, '[Best Seller] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 99,000Đ', 'http://localhost:4000/uploads/products/prod-1766911139052-115204636.png', 1, 99000.00, 99000.00, '{\"Chọn loại gà\": \"Gà giòn không cay\", \"Chọn loại nước\": \"Coca\"}'),
(23, 'ORDDC80538A916146F99B9949FC415DFEB2', 37, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 89,000Đ', 'http://localhost:4000/uploads/products/prod-1766915183860-285845778.png', 1, 89000.00, 89000.00, '{}'),
(24, 'ORD9C3C84FC38174D1EB580874024C9E91B', 20, '[Gà Xốt] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 115,000Đ', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766911376045-757574466.png', 1, 115000.00, 115000.00, '{\"Chọn gà xốt\": \"Gà tắm nước mắm \", \"Chọn loại gà\": \"Gà giòn cay\", \"Chọn loại nước\": \"Sprite \"}'),
(25, 'ORD9C3C84FC38174D1EB580874024C9E91B', 22, 'Combo Tiệc Gà 99.000Đ CB2', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766911699775-994686442.png', 2, 99000.00, 198000.00, '{\"Chọn loại gà\": \"Gà giòn cay \"}'),
(26, 'ORD9C3C84FC38174D1EB580874024C9E91B', 32, 'Mì Ý Phô Mai Donut Tôm (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766912375111-985119380.png', 1, 69000.00, 69000.00, '{}'),
(27, 'ORD9C3C84FC38174D1EB580874024C9E91B', 18, 'Combo Burger Gà B (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766910975084-897727569.png', 3, 95000.00, 285000.00, '{}'),
(28, 'ORDA4D167581C754A4CBFCC3A30BB5C5E67', 20, '[Gà Xốt] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 115,000Đ', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766911376045-757574466.png', 1, 115000.00, 115000.00, '{\"Chọn gà xốt\": \"Gà Charsiu\", \"Chọn loại gà\": \"Gà giòn cay\", \"Chọn loại nước\": \"Coca \"}'),
(29, 'ORDA4D167581C754A4CBFCC3A30BB5C5E67', 16, 'Combo Burger Tôm (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766910927351-194386158.png', 1, 59000.00, 59000.00, '{}'),
(30, 'ORDA4D167581C754A4CBFCC3A30BB5C5E67', 32, 'Mì Ý Phô Mai Donut Tôm (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766912375111-985119380.png', 1, 69000.00, 69000.00, '{}'),
(31, 'ORDA4D167581C754A4CBFCC3A30BB5C5E67', 13, '6 miếng gà giòn (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766910745786-806895767.png', 1, 209000.00, 209000.00, '{\"Chọn loại gà\": \"Gà giòn không cay\"}'),
(32, 'ORDA4D167581C754A4CBFCC3A30BB5C5E67', 30, 'Combo CharSiu Couple (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766912151475-996830714.png', 5, 169000.00, 845000.00, '{}'),
(33, 'ORD05656C243BAC4A9EAFA69EDF00C80816', 11, '1 Miếng gà giòn (Alacarte)', '/uploads/products/prod-1766910544783-960612940.png', 1, 37000.00, 37000.00, '{}'),
(34, 'ORD05656C243BAC4A9EAFA69EDF00C80816', 16, 'Combo Burger Tôm (Alacarte)', '/uploads/products/prod-1766910927351-194386158.png', 2, 59000.00, 118000.00, '{}'),
(35, 'ORD05656C243BAC4A9EAFA69EDF00C80816', 38, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', '/uploads/products/prod-1766915212187-314182857.png', 1, 110000.00, 110000.00, '{}'),
(36, 'ORD05656C243BAC4A9EAFA69EDF00C80816', 13, '6 miếng gà giòn (Alacarte)', '/uploads/products/prod-1766910745786-806895767.png', 3, 209000.00, 627000.00, '{\"Chọn loại gà\": \"Gà giòn cay\"}'),
(37, 'ORD05656C243BAC4A9EAFA69EDF00C80816', 34, 'Cơm BBQ gà không xương (Alacarte)', '/uploads/products/prod-1766912416547-953261154.png', 2, 45000.00, 90000.00, '{}'),
(38, 'ORD05656C243BAC4A9EAFA69EDF00C80816', 32, 'Mì Ý Phô Mai Donut Tôm (Alacarte)', '/uploads/products/prod-1766912375111-985119380.png', 1, 69000.00, 69000.00, '{}'),
(39, 'ORDF6857E05933F451FB90534C2DFB2F80D', 38, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', '/uploads/products/prod-1766915212187-314182857.png', 2, 110000.00, 220000.00, '{}'),
(40, 'ORDF6857E05933F451FB90534C2DFB2F80D', 37, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 89,000Đ', '/uploads/products/prod-1766915183860-285845778.png', 1, 89000.00, 89000.00, '{}'),
(41, 'ORDF6857E05933F451FB90534C2DFB2F80D', 58, 'COMBO FAMILY D (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948556487-650230255.png', 10, 369000.00, 3690000.00, '{}'),
(42, 'ORDF6857E05933F451FB90534C2DFB2F80D', 57, 'COMBO FAMILY C (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948520710-956262503.png', 11, 329000.00, 3619000.00, '{}'),
(43, 'ORDF6857E05933F451FB90534C2DFB2F80D', 56, ' COMBO FAMILY B (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948472072-896411570.png', 37, 279000.00, 10323000.00, '{}'),
(44, 'ORDF6857E05933F451FB90534C2DFB2F80D', 55, 'COMBO FAMILY A (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948400005-337882419.png', 20, 209000.00, 4180000.00, '{}'),
(45, 'ORDE6CDB924B3C94AE5BADB013E2BFAF46A', 58, 'COMBO FAMILY D (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948556487-650230255.png', 1, 369000.00, 369000.00, '{}'),
(46, 'ORD0D7D377A1CEC47E78798E7B905032104', 57, 'COMBO FAMILY C (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948520710-956262503.png', 1, 329000.00, 329000.00, '{}'),
(47, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 38, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766915212187-314182857.png', 1, 110000.00, 110000.00, '{}'),
(48, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 37, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 89,000Đ', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766915183860-285845778.png', 1, 89000.00, 89000.00, '{}'),
(49, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 20, '[Gà Xốt] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 115,000Đ', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766911376045-757574466.png', 1, 115000.00, 115000.00, '{\"Chọn gà xốt\": \"Gà Charsiu\", \"Chọn loại gà\": \"Gà giòn không cay\", \"Chọn loại nước\": \"Sprite \"}'),
(50, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 19, '[Best Seller] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 99,000Đ', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766911139052-115204636.png', 1, 99000.00, 99000.00, '{\"Chọn loại gà\": \"Gà giòn không cay\", \"Chọn loại nước\": \"Coca\"}'),
(51, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 58, 'COMBO FAMILY D (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948556487-650230255.png', 10, 369000.00, 3690000.00, '{}'),
(52, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 35, 'Combo Mì Ý 2 (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766912465301-784598358.png', 20, 139000.00, 2780000.00, '{\"Chọn loại gà\": \"Gà không cay\"}'),
(53, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 57, 'COMBO FAMILY C (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948520710-956262503.png', 30, 329000.00, 9870000.00, '{}'),
(54, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 56, ' COMBO FAMILY B (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766948472072-896411570.png', 40, 279000.00, 11160000.00, '{}'),
(55, 'ORDD5C9792519FD4D93903FEBABC03AAFD5', 18, 'Combo Burger Gà B (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766910975084-897727569.png', 20, 95000.00, 1900000.00, '{}'),
(56, 'ORD9D38C119A8E848FFB89D0899B83FECA0', 54, 'Bắp cải trộn size Vừa (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766946611530-443670701.png', 8, 25000.00, 200000.00, '{}'),
(57, 'ORD9D38C119A8E848FFB89D0899B83FECA0', 32, 'Mì Ý Phô Mai Donut Tôm (Alacarte)', 'https://zcnnd210-4000.use2.devtunnels.ms/uploads/products/prod-1766912375111-985119380.png', 7, 69000.00, 483000.00, '{}');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `original_price`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
(9, 4, 'Combo Gà giòn - 1 miếng (Alacarte)', 'combo-ga-gion-1-mieng-(alacarte)', 'Phần ăn gồm: 01 Gà giòn + 01 Khoai tây chiên (S) + 01 Nước ngọt', 59000.00, 59000.00, '/uploads/products/prod-1766909271263-671831812.png', 1, '2025-12-28 08:07:51', '2025-12-28 08:07:51'),
(10, 4, 'Combo Gà giòn - 2 miếng (Alacarte)', 'combo-ga-gion-2-mieng-(alacarte)', 'Phần ăn gồm: 02 Gà giòn + 01 Khoai tây chiên (S) + 01 Nước ngọt', 89000.00, 89000.00, '/uploads/products/prod-1766909358603-229899720.png', 1, '2025-12-28 08:09:18', '2025-12-28 08:09:18'),
(11, 4, '1 Miếng gà giòn (Alacarte)', '1-mieng-ga-gion-(alacarte)', 'Gà giòn Cay/ Không Cay Phần gà được phục vụ ngẫu nhiên\r\n', 37000.00, 3700.00, '/uploads/products/prod-1766910544783-960612940.png', 1, '2025-12-28 08:29:04', '2025-12-28 08:29:04'),
(12, 4, '3 miếng gà giòn (Alacarte)', '3-mieng-ga-gion-(alacarte)', '3 miếng gà giòn cay/không cay', 109000.00, 109000.00, '/uploads/products/prod-1766910643621-448031037.png', 1, '2025-12-28 08:30:43', '2025-12-28 08:30:43'),
(13, 4, '6 miếng gà giòn (Alacarte)', '6-mieng-ga-gion-(alacarte)', '6 miếng gà giòn cay/không cay (*Hình ảnh minh họa cho 3 miếng)\r\n', 209000.00, 209000.00, '/uploads/products/prod-1766910745786-806895767.png', 1, '2025-12-28 08:32:25', '2025-12-28 08:32:25'),
(14, 6, 'Burger Tôm (Alacarte)', 'burger-tom-(alacarte)', 'Burger Tôm', 49000.00, 49000.00, '/uploads/products/prod-1766910876108-468860837.png', 1, '2025-12-28 08:34:36', '2025-12-28 08:34:36'),
(15, 6, 'Burger Cá (Alacarte)', 'burger-ca-(alacarte)', '1 Burger Cá\r\n', 49000.00, 49000.00, '/uploads/products/prod-1766910898657-6755795.png', 1, '2025-12-28 08:34:58', '2025-12-28 08:34:58'),
(16, 6, 'Combo Burger Tôm (Alacarte)', 'combo-burger-tom-(alacarte)', '1 Burger Tôm + 1 Thức Uống\r\n', 59000.00, 59000.00, '/uploads/products/prod-1766910927351-194386158.png', 1, '2025-12-28 08:35:27', '2025-12-28 08:35:27'),
(17, 6, 'Combo Burger Gà C (Alacarte)', 'combo-burger-ga-c-(alacarte)', 'Phần ăn gồm: 01 Burger gà phi lê + 01 Khoai tây chiên (S) + 01 nước ngọt\r\n', 69000.00, 69000.00, '/uploads/products/prod-1766910948962-493593372.png', 1, '2025-12-28 08:35:48', '2025-12-28 08:35:48'),
(18, 6, 'Combo Burger Gà B (Alacarte)', 'combo-burger-ga-b-(alacarte)', '1 Burger Gà Phi Lê 1 Miếng gà giòn 1 Khoai tây nghiền hoặc Salad chanh dây 1 Nước ngọt\r\n', 95000.00, 95000.00, '/uploads/products/prod-1766910975084-897727569.png', 1, '2025-12-28 08:36:15', '2025-12-28 08:36:15'),
(19, 2, '[Best Seller] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 99,000Đ', 'best-seller-sieu-tiec-ga-gion-4-mieng-ga-2-nuoc-chi-99000d', 'Phần ăn gồm: 04 Miếng Gà Giòn + 02 Nước Ngọt chỉ 99,000đ (Giảm khi thêm giỏ hàng)\r\n', 99000.00, 178000.00, '/uploads/products/prod-1766911139052-115204636.png', 1, '2025-12-28 08:38:59', '2025-12-28 08:38:59'),
(20, 2, '[Gà Xốt] Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 115,000Đ', 'ga-xot-sieu-tiec-ga-gion-4-mieng-ga-2-nuoc-chi-115000d', 'Phần ăn gồm: 02 Miếng Gà Charsiu hoặc Gà Nước Mắm + 02 Miếng Gà Giòn + 02 Nước Ngọt chỉ 115,000đ (Giảm khi thêm giỏ hàng)\r\n', 115000.00, 192000.00, '/uploads/products/prod-1766911376045-757574466.png', 1, '2025-12-28 08:42:56', '2025-12-28 08:42:56'),
(21, 1, 'Combo Tiệc Gà 99.000Đ CB1', 'combo-tiec-ga-99.000d-cb1', 'Phần ăn gồm: 03 Miếng Gà Giòn + 1 Khoai tây chiên (S) + 2 Nước ngọt chỉ 99,000đ', 99000.00, 166000.00, '/uploads/products/prod-1766911544325-607681188.png', 1, '2025-12-28 08:45:44', '2025-12-28 08:45:44'),
(22, 1, 'Combo Tiệc Gà 99.000Đ CB2', 'combo-tiec-ga-99.000d-cb2', 'Phần ăn gồm: 02 Miếng Gà Giòn + 1 Khoai tây chiên (R) + 1 Popcorn (L) + 2 Nước ngọt chỉ 99,000đ\r\n', 99000.00, 162000.00, '/uploads/products/prod-1766911699775-994686442.png', 1, '2025-12-28 08:48:19', '2025-12-28 08:48:19'),
(23, 1, 'Combo Gà + Mì Ý \"Siêu No\" Chỉ 89K', 'combo-ga-+-mi-y-\"sieu-no\"-chi-89k', 'Phần ăn gồm: 01 Gà giòn + 01 Mì Ý + 01 Popcorn chỉ 89K', 89000.00, 107000.00, '/uploads/products/prod-1766911742423-130285414.png', 1, '2025-12-28 08:49:02', '2025-12-28 08:49:02'),
(24, 1, 'Combo Gà + Burger Phi Lê \"Siêu No\" Chỉ 89K', 'combo-ga-+-burger-phi-le-\"sieu-no\"-chi-89k', 'Phần ăn gồm: 01 Gà giòn + 01 Burger + 01 Popcorn chỉ 89K', 89000.00, 111000.00, '/uploads/products/prod-1766911807646-953831812.png', 1, '2025-12-28 08:50:07', '2025-12-28 08:50:07'),
(25, 3, 'Gà Giòn Xốt Charsiu (Alacarte)', 'ga-gion-xot-charsiu-(alacarte)', 'Phần ăn gồm: 01 Gà Giòn Xốt Charsiu\r\n', 44000.00, 44000.00, '/uploads/products/prod-1766911962514-73462937.png', 1, '2025-12-28 08:52:42', '2025-12-28 08:52:42'),
(26, 3, '3 miếng Gà Không Xương Xốt Charsiu (Alacarte)', '3-mieng-ga-khong-xuong-xot-charsiu-(alacarte)', 'Phần ăn gồm: Combo 3 miếng Gà Không Xương Xốt Charsiu\r\n', 59000.00, 59000.00, '/uploads/products/prod-1766911983396-605240164.jpg', 1, '2025-12-28 08:53:03', '2025-12-28 08:53:03'),
(27, 3, '6 miếng Gà Không Xương Xốt Charsiu (Alacarte)', '6-mieng-ga-khong-xuong-xot-charsiu-(alacarte)', 'Phần ăn gồm: Combo 6 miếng Gà Không Xương Xốt Charsiu\r\n', 99000.00, 99000.00, '/uploads/products/prod-1766912016647-433620203.jpg', 1, '2025-12-28 08:53:36', '2025-12-28 08:53:36'),
(28, 3, 'Combo CharSiu Lover (Alacarte)', 'combo-charsiu-lover-(alacarte)', 'Phần ăn gồm: 01 Gà Giòn Xốt Xá Xíu + 01 Mì Ý + 01 Nước Ngọt\r\n', 87000.00, 87000.00, '/uploads/products/prod-1766912041315-462770046.png', 1, '2025-12-28 08:54:01', '2025-12-28 08:54:01'),
(29, 3, 'Combo CharSiu So Chill (Alacarte)', 'combo-charsiu-so-chill-(alacarte)', 'Phần ăn gồm: 01 Gà Giòn Xốt Xá Xíu + 01 Gà Giòn (Cay/Không Cay) + 01 Khoai Tây Chiên (S) + 01 Nước Ngọt\r\n', 97000.00, 97000.00, '/uploads/products/prod-1766912121796-565802042.png', 1, '2025-12-28 08:55:21', '2025-12-28 08:55:21'),
(30, 3, 'Combo CharSiu Couple (Alacarte)', 'combo-charsiu-couple-(alacarte)', 'Phần ăn gồm: 02 Gà Giòn Xốt Xá Xíu + 01 Popcorn Org + 01 Mì ý hoặc Burger cá + 01 Bắp cải trộn (M) + 02 Nước\r\n', 169000.00, 169000.00, '/uploads/products/prod-1766912151475-996830714.png', 1, '2025-12-28 08:55:51', '2025-12-28 08:55:51'),
(31, 7, 'Mì Ý Phô Mai Gà Viên (Alacarte)', 'mi-y-pho-mai-ga-vien-(alacarte)', 'Phần ăn gồm: 1 Mì Ý Phô Mai Gà Viên\r\n', 55000.00, 54998.00, '/uploads/products/prod-1766912351022-82738081.png', 1, '2025-12-28 08:59:11', '2025-12-28 08:59:11'),
(32, 7, 'Mì Ý Phô Mai Donut Tôm (Alacarte)', 'mi-y-pho-mai-donut-tom-(alacarte)', 'Phần ăn gồm: 1 Mì Ý Phô Mai + 1 Donut Tôm\r\n', 69000.00, 69000.00, '/uploads/products/prod-1766912375111-985119380.png', 1, '2025-12-28 08:59:35', '2025-12-28 08:59:35'),
(33, 7, 'Combo Mì Ý 1 (Alacarte)', 'combo-mi-y-1-(alacarte)', 'Phần ăn gồm: 01 Mì Ý + 01 Gà giòn + 01 Nước ngọt\r\n', 79000.00, 79000.00, '/uploads/products/prod-1766912397483-175154420.png', 1, '2025-12-28 08:59:57', '2025-12-28 08:59:57'),
(34, 7, 'Cơm BBQ gà không xương (Alacarte)', 'com-bbq-ga-khong-xuong-(alacarte)', '01 Cơm BBQ gà không xương\r\n', 45000.00, 45000.00, '/uploads/products/prod-1766912416547-953261154.png', 1, '2025-12-28 09:00:16', '2025-12-28 09:00:16'),
(35, 7, 'Combo Mì Ý 2 (Alacarte)', 'combo-mi-y-2-(alacarte)', 'Phần ăn gồm: 02 Mì Ý + 01 Gà giòn + 1 Khoai tây chiên (S) + 2 Nước ngọt\r\n', 139000.00, 139000.00, '/uploads/products/prod-1766912465301-784598358.png', 1, '2025-12-28 09:01:05', '2025-12-28 09:01:05'),
(37, 2, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 89,000Đ', 'sieu-tiec-ga-gion-4-mieng-ga-2-nuoc-chi-89000d', '', 89000.00, 89000.00, '/uploads/products/prod-1766915183860-285845778.png', 1, '2025-12-28 09:46:23', '2025-12-28 09:46:23'),
(38, 2, 'Siêu Tiệc Gà Giòn - 4 Miếng Gà 2 Nước chỉ 110,000Đ', 'sieu-tiec-ga-gion-4-mieng-ga-2-nuoc-chi-110000d', '', 110000.00, 110000.00, '/uploads/products/prod-1766915212187-314182857.png', 0, '2025-12-28 09:46:52', '2025-12-28 16:36:31'),
(39, 5, '2 ly Soda Vải Hoa Hồng (Alacarte)', '2-ly-soda-vai-hoa-hong-(alacarte)', 'Phần ăn gồm: 2 Nước Soda Vải Hoa Hồng', 60000.00, 60000.00, '/uploads/products/prod-1766943861437-769128646.png', 1, '2025-12-28 17:44:22', '2025-12-28 17:44:22'),
(40, 5, '1 ly Soda Vải Hoa Hồng (Alacarte)', '1-ly-soda-vai-hoa-hong-(alacarte)', 'Phần ăn gồm: 1 Nước Soda Vải Hoa Hồng', 35000.00, 35000.00, '/uploads/products/prod-1766944010427-482017794.png', 1, '2025-12-28 17:46:51', '2025-12-28 17:46:51'),
(41, 5, 'Dasani (Alacarte)', 'dasani-(alacarte)', 'Dasani', 15000.00, 15000.00, '/uploads/products/prod-1766944120526-412482957.jpg', 1, '2025-12-28 17:48:41', '2025-12-28 17:48:41'),
(42, 5, ' Coca Cola (Alacarte)', 'coca-cola-(alacarte)', 'Coca Cola', 15000.00, 15000.00, '/uploads/products/prod-1766944172316-685824125.png', 1, '2025-12-28 17:49:33', '2025-12-28 17:49:33'),
(43, 5, ' Sprite (Alacarte)', 'sprite-(alacarte)', 'Sprite TA', 15000.00, 15000.00, '/uploads/products/prod-1766944224002-852373613.png', 1, '2025-12-28 17:50:25', '2025-12-28 17:50:25'),
(44, 5, 'Fanta (Alacarte)', 'fanta-(alacarte)', 'Fanta TA', 15000.00, 15000.00, '/uploads/products/prod-1766944270567-722178674.png', 1, '2025-12-28 17:51:11', '2025-12-28 17:51:11'),
(45, 5, ' Coke Zero (Alacarte)', 'coke-zero-(alacarte)', 'Coke Zero', 15000.00, 15000.00, '/uploads/products/prod-1766944343896-83329495.png', 1, '2025-12-28 17:52:25', '2025-12-28 17:52:25'),
(46, 8, '3 Thanh Phô Mai Que (Alacarte)', '3-thanh-pho-mai-que-(alacarte)', '3 Thanh Phô Mai Que', 39000.00, 39000.00, '/uploads/products/prod-1766944719134-396298777.jpg', 1, '2025-12-28 17:58:39', '2025-12-28 17:58:39'),
(47, 8, ' 2 miếng Snack cá (Alacarte)', '2-mieng-snack-ca-(alacarte)', '01 Snack cá (2 miếng)', 18000.00, 18000.00, '/uploads/products/prod-1766944893743-827376112.png', 1, '2025-12-28 18:01:34', '2025-12-28 18:01:34'),
(48, 8, 'Bánh Khoai lang (Alacarte)', 'banh-khoai-lang-(alacarte)', 'Bánh khoai lang nhân Dứa/ Phô mai (3 viên)', 29000.00, 29000.00, '/uploads/products/prod-1766945063838-192119900.png', 1, '2025-12-28 18:04:25', '2025-12-28 18:04:25'),
(49, 8, ' Khoai tây chiên size nhỏ (Alacarte)', 'khoai-tay-chien-size-nho-(alacarte)', '01 Khoai tây chiên (Cỡ nhỏ)', 25000.00, 25000.00, '/uploads/products/prod-1766945163255-208955865.png', 1, '2025-12-28 18:06:04', '2025-12-28 18:06:04'),
(50, 8, ' Cơm Trắng (Alacarte)', 'com-trang-(alacarte)', 'Cơm Trắng', 10000.00, 10000.00, '/uploads/products/prod-1766945254478-243261245.png', 1, '2025-12-28 18:07:35', '2025-12-28 18:07:35'),
(51, 8, ' Donut Tôm (Alacarte)', 'donut-tom-(alacarte)', 'Donut Tôm', 29000.00, 29000.00, '/uploads/products/prod-1766945346412-592623068.png', 1, '2025-12-28 18:09:07', '2025-12-28 18:09:07'),
(52, 8, ' Gà Viên Xốt Charsiu (cỡ vừa) (Alacarte)', 'ga-vien-xot-charsiu-(co-vua)-(alacarte)', 'Phần ăn gồm: 01 Gà Viên Xốt Charsiu cỡ vừa', 29000.00, 29000.00, '/uploads/products/prod-1766946510328-918581517.png', 1, '2025-12-28 18:28:32', '2025-12-28 18:28:32'),
(53, 8, 'Gà Popcorn Xốt Phô Mai size Vừa (Alacarte)', 'ga-popcorn-xot-pho-mai-size-vua-(alacarte)', '1 Gà Popcorn Xốt Phô Mai (Size Vừa)', 29000.00, 29000.00, '/uploads/products/prod-1766946556232-54632001.png', 1, '2025-12-28 18:29:17', '2025-12-28 18:29:17'),
(54, 8, 'Bắp cải trộn size Vừa (Alacarte)', 'bap-cai-tron-size-vua-(alacarte)', 'Bắp cải trộn (Vừa)', 25000.00, 25000.00, '/uploads/products/prod-1766946611530-443670701.png', 1, '2025-12-28 18:30:12', '2025-12-28 18:30:12'),
(55, 9, 'COMBO FAMILY A (Alacarte)', 'combo-family-a-(alacarte)', 'Phần ăn gồm: 03 Gà giòn+ 01 Mì Ý + 01 Popcorn + 01 Khoai tây chiên (S) + 03 Nước ngọt', 209000.00, 209000.00, '/uploads/products/prod-1766948400005-337882419.png', 1, '2025-12-28 19:00:01', '2025-12-28 19:03:42'),
(56, 9, ' COMBO FAMILY B (Alacarte)', 'combo-family-b-(alacarte)', 'Phần ăn gồm: 05 Gà giòn + 03 Gà không xương + 01 Salad xốt chanh dây + 01 Khoai tây chiên (S) + 03 Nước uống', 279000.00, 279000.00, '/uploads/products/prod-1766948472072-896411570.png', 1, '2025-12-28 19:01:13', '2025-12-28 19:04:24'),
(57, 9, 'COMBO FAMILY C (Alacarte)', 'combo-family-c-(alacarte)', 'Phần ăn gồm: 05 Gà giòn + 01 Mì Ý + 01 Burger gà phi lê + 01 Khoai tây chiên (L) hoặc gà popcorn + 4 Nước ngọt', 329000.00, 329000.00, '/uploads/products/prod-1766948520710-956262503.png', 1, '2025-12-28 19:02:02', '2025-12-28 19:02:02'),
(58, 9, 'COMBO FAMILY D (Alacarte)', 'combo-family-d-(alacarte)', 'Phần ăn gồm: 06 Gà giòn + 02 Mì Ý + 01 Salad xốt chanh dây + 01 Khoai tây chiên (S) + 04 Nước ngọt', 369000.00, 369000.00, '/uploads/products/prod-1766948556487-650230255.png', 0, '2025-12-28 19:02:38', '2025-12-28 20:27:08');

-- --------------------------------------------------------

--
-- Table structure for table `product_options`
--

CREATE TABLE `product_options` (
  `id` int NOT NULL,
  `group_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `price_adjustment` decimal(10,2) DEFAULT '0.00',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `product_options`
--

INSERT INTO `product_options` (`id`, `group_id`, `name`, `price_adjustment`, `is_default`, `created_at`) VALUES
(11, 7, 'Gà giòn cay', 0.00, 0, '2025-12-28 08:09:18'),
(12, 7, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:09:18'),
(13, 9, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:30:43'),
(14, 9, 'Gà giòn cay', 0.00, 0, '2025-12-28 08:30:43'),
(15, 10, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:32:25'),
(16, 10, 'Gà giòn cay', 0.00, 0, '2025-12-28 08:32:25'),
(17, 11, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:38:59'),
(18, 11, 'Gà giòn cay', 0.00, 0, '2025-12-28 08:38:59'),
(19, 12, 'Coca', 0.00, 0, '2025-12-28 08:38:59'),
(20, 12, 'Pepsi', 0.00, 0, '2025-12-28 08:38:59'),
(21, 13, 'Gà Charsiu', 0.00, 0, '2025-12-28 08:42:56'),
(22, 13, 'Gà tắm nước mắm ', 0.00, 0, '2025-12-28 08:42:56'),
(23, 14, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:42:56'),
(24, 14, 'Gà giòn cay', 0.00, 0, '2025-12-28 08:42:56'),
(25, 15, 'Coca ', 0.00, 0, '2025-12-28 08:42:56'),
(26, 15, 'Sprite ', 0.00, 0, '2025-12-28 08:42:56'),
(27, 16, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:45:44'),
(28, 16, 'Gà giòn cay ', 0.00, 0, '2025-12-28 08:45:44'),
(29, 17, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:48:19'),
(30, 17, 'Gà giòn cay ', 0.00, 0, '2025-12-28 08:48:19'),
(31, 18, 'Gà giòn không cay', 0.00, 0, '2025-12-28 08:55:21'),
(32, 18, 'Gà giòn cay', 0.00, 0, '2025-12-28 08:55:21'),
(33, 19, 'Gà không cay', 0.00, 0, '2025-12-28 09:01:05'),
(34, 19, 'Gà cay', 0.00, 0, '2025-12-28 09:01:05'),
(35, 20, 'Bánh khoai lang nhân Phô mai ', 1.00, 0, '2025-12-28 18:04:25'),
(36, 20, 'Bánh khoai lang nhân Dứa', 1.00, 0, '2025-12-28 18:04:25');

-- --------------------------------------------------------

--
-- Table structure for table `product_option_groups`
--

CREATE TABLE `product_option_groups` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `min_select` int DEFAULT '1',
  `max_select` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `product_option_groups`
--

INSERT INTO `product_option_groups` (`id`, `product_id`, `name`, `is_required`, `min_select`, `max_select`, `created_at`) VALUES
(7, 10, 'Chọn loại gà', 0, 2, 2, '2025-12-28 08:09:18'),
(8, 11, 'Chọn loại gà', 0, 1, 1, '2025-12-28 08:29:04'),
(9, 12, 'Chọn loại gà', 0, 3, 3, '2025-12-28 08:30:43'),
(10, 13, 'Chọn loại gà', 0, 6, 6, '2025-12-28 08:32:25'),
(11, 19, 'Chọn loại gà', 0, 4, 4, '2025-12-28 08:38:59'),
(12, 19, 'Chọn loại nước', 0, 2, 2, '2025-12-28 08:38:59'),
(13, 20, 'Chọn gà xốt', 0, 2, 2, '2025-12-28 08:42:56'),
(14, 20, 'Chọn loại gà', 0, 2, 2, '2025-12-28 08:42:56'),
(15, 20, 'Chọn loại nước', 0, 2, 2, '2025-12-28 08:42:56'),
(16, 21, 'Chọn loại gà', 0, 3, 3, '2025-12-28 08:45:44'),
(17, 22, 'Chọn loại gà', 0, 1, 1, '2025-12-28 08:48:19'),
(18, 29, 'Chọn loại gà', 0, 1, 1, '2025-12-28 08:55:21'),
(19, 35, 'Chọn loại gà', 0, 1, 1, '2025-12-28 09:01:05'),
(20, 48, 'Chọn vị bánh', 0, 1, 1, '2025-12-28 18:04:25');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `valid_days` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT 'All',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `name`, `slug`, `image`, `description`, `start_date`, `end_date`, `valid_days`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'ĐẶT ĐƠN ONLINE NHẬN THÊM ƯU ĐÃI', 'dat-don-online-nhan-them-uu-dai', '/uploads/promotions/promo-1766915516409.png', '🔸 NHẬP MÃ CRISPC10 - Nhận ngay ưu đãi 10.000Đ cho đơn từ 60.000Đ.\r\n\r\n🔸 NHẬP MÃ  CRISPC20 - Nhận ngay ưu đãi 20.000Đ cho đơn từ 110.000Đ.\r\n\r\n🔸 NHẬP MÃ  CRISPC35 - Nhận ngay ưu đãi 35.000Đ cho đơn từ 180.000Đ.\r\n\r\n🔸 NHẬP MÃ  CRISPC50 - Nhận ngay ưu đãi 50.000Đ cho đơn từ 200.000Đ.\r\n\r\n🔸 NHẬP MÃ  CRISPC90 - Nhận ngay ưu đãi 90.000Đ cho đơn từ 350.000Đ.', '2025-12-28 16:51:00', '2026-12-28 16:51:00', 'All', 1, '2025-12-28 09:51:56', '2025-12-28 09:51:56'),
(3, 'MUA 1 TẶNG 1 THỨ 4', 'mua-1-tang-1-thu-4', '/uploads/promotions/promo-1766915644494.png', 'Mua 1 được 2 khi đặt qua app/web Popeyes hoặc Hotline 19006008 vào thứ 4', '2025-12-28 16:53:00', '2026-12-28 16:53:00', '4', 1, '2025-12-28 09:54:04', '2025-12-28 09:54:04'),
(4, 'SIÊU TIỆC MÌ Ý THỨ 3 & THỨ 5 HẰNG TUẦN', 'sieu-tiec-mi-y-thu-3-and-thu-5-hang-tuan', '/uploads/promotions/promo-1766915720228.png', '', '2025-12-28 16:54:00', '2026-12-28 16:54:00', '3,5', 1, '2025-12-28 09:55:20', '2025-12-28 09:55:20'),
(5, 'GÀ CHAR SIU - NGON \"LẮM CHIÊU\"', 'ga-char-siu-ngon-\"lam-chieu\"', '/uploads/promotions/promo-1766915777880.png', ' GÀ CHAR SIU - NGON \"LẮM CHIÊU\", ĐẬM ĐÀ PHIÊU TIỆC CHÍNH THỨC LÊN SÓNG \r\n\r\n\r\n Cất công \"tung hint\" mấy bữa nay, làm dân tình đồn đoán xôn xao, hôm nay Popeyes chính thức hé lộ \"party star\" của mùa lễ hội này: GÀ CHAR SIU \r\n\r\nSẵn sàng có mặt trong mọi menu tiệc tùng, khuấy động mọi cuộc vui, tung chiêu \"phiêu tiệc\"', '2025-12-28 16:55:00', '2026-12-28 16:55:00', 'All', 1, '2025-12-28 09:56:17', '2025-12-28 09:56:17'),
(6, 'PHIÊU TIỆC \"CHẤM ĐẪMMMMMM\" CÙNG XỐT \"LẮM CHIÊU\"', 'phieu-tiec-\"cham-dammmmmm\"-cung-xot-\"lam-chieu\"', '/uploads/promotions/promo-1766915827808.png', ' HOT TREND HAS ARRIVED !!!! PHIÊU TIỆC \"CHẤM ĐẪMMMMMM\" CÙNG XỐT \"LẮM CHIÊU\" \r\n\r\n BIG SAUCE CỰC ĐẪMMMM chính thức đổ bộ  Hot trend thế giới nay đã có mặt tại Popeyes Việt Nam mùa lễ hội này: chấm là phải đẫm, ăn là phải phiêu 😮‍🔥\r\n\r\n\"Lắm chiêu\" chấm đẫmmm với 2 dòng xốt \"signature\":\r\n\r\n BBQ Sauce: Chuẩn vị Louisiana thơm lừng mùi khói, mặn ngọt vừa ăn.\r\n\r\n Chili Fish Sauce: Vị xốt Gà Tắm Nước Mắm nổi tiếng độc quyền Popeyes, ngọt cay cuốn hút.', '2025-12-28 16:56:00', '2026-12-28 16:56:00', 'All', 1, '2025-12-28 09:57:07', '2025-12-28 09:57:07');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_products`
--

CREATE TABLE `promotion_products` (
  `promotion_id` int NOT NULL,
  `product_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `promotion_products`
--

INSERT INTO `promotion_products` (`promotion_id`, `product_id`) VALUES
(3, 10),
(3, 11),
(5, 25),
(5, 28),
(5, 29),
(5, 30),
(6, 31),
(4, 32),
(6, 32),
(4, 33),
(6, 33),
(6, 35);

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(30, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjY4NTYzMjUsImV4cCI6MTc2NzQ2MTEyNX0.0LPSpAmgCR9YH7R7CaBNjV-VyFX0gXSSSWM-2wCgJco', '2026-01-04 00:25:26', '2025-12-27 17:25:25'),
(68, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3NjY5Mjc5MDIsImV4cCI6MTc2NzUzMjcwMn0.fiqBNhohLeP_iWOMQ66O7hX9YDUzBj2cfSkdkZ5RSow', '2026-01-04 20:18:22', '2025-12-28 13:18:22'),
(69, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTI3OTk0LCJleHAiOjE3Njc1MzI3OTR9.jHmxPxsVuAhJBGymBDSX5tFplpBmWriAYr3GxMXnCOA', '2026-01-04 20:19:55', '2025-12-28 13:19:54'),
(75, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTMwNTk2LCJleHAiOjE3Njc1MzUzOTZ9.U_GJtljPzQ03e4ltp9kR2efKeEiZnE2dEzCRxwukFgM', '2026-01-04 21:03:16', '2025-12-28 14:03:16'),
(77, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTMxMDY5LCJleHAiOjE3Njc1MzU4Njl9.LFc2koafslu7Gi-c09CeZr-lD0yvVftO-mBwv5y6wlc', '2026-01-04 21:11:09', '2025-12-28 14:11:09'),
(83, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTM5NjIzLCJleHAiOjE3Njc1NDQ0MjN9.LJscNrA5sKcf0-fejb7fWctbydGOCbWk012aPvcLIqI', '2026-01-04 23:33:44', '2025-12-28 16:33:43'),
(85, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTQwNDkzLCJleHAiOjE3Njc1NDUyOTN9.ntWL1D5_R5A8BPFzwQZBdG7BmRekt6pybshhwCeMsf8', '2026-01-04 23:48:14', '2025-12-28 16:48:13'),
(102, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTQ3NjYxLCJleHAiOjE3Njc1NTI0NjF9.hF3K-XdnbB_tYr1Axd_vrT2omqYztOIH4krxf35JLwo', '2026-01-05 01:47:41', '2025-12-28 18:47:41'),
(103, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTQ3NzM3LCJleHAiOjE3Njc1NTI1Mzd9.Yu6chRVUbb9LC6JhYkwZTOp-t9_Y1NtVRUpP9CxFUUU', '2026-01-05 01:48:58', '2025-12-28 18:48:57'),
(104, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTQ3OTY2LCJleHAiOjE3Njc1NTI3NjZ9.4Lq1oajVqGkfoNo4OyjKdHL-LOYC0NRInu0XwMjyPyU', '2026-01-05 01:52:47', '2025-12-28 18:52:46'),
(112, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTUxMjk3LCJleHAiOjE3Njc1NTYwOTd9.yjIXhz6woxn9GGAYxRoyekek4Lxzxt22JOhkkIoAn-E', '2026-01-05 02:48:17', '2025-12-28 19:48:17'),
(115, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0YWZmIiwiaWF0IjoxNzY2OTUxNDQyLCJleHAiOjE3Njc1NTYyNDJ9.SiNxZ60E8iqDHwHSn-y88yM_Bic1e6GencwahyfiyP0', '2026-01-05 02:50:43', '2025-12-28 19:50:42'),
(116, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0YWZmIiwiaWF0IjoxNzY2OTUxNDgxLCJleHAiOjE3Njc1NTYyODF9.2nb0DsPqmnloDlq0qAc12L5XVkdEHczxRMX8pznFc4Y', '2026-01-05 02:51:22', '2025-12-28 19:51:21'),
(121, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6InVzZXIiLCJpYXQiOjE3NjY5NTI1ODMsImV4cCI6MTc2NzU1NzM4M30.9jDt_oaBr9sEQu8JvKSzQtKL3DI1a6DYq5WUhrV9AYg', '2026-01-05 03:09:43', '2025-12-28 20:09:43'),
(123, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6InN0YWZmIiwiaWF0IjoxNzY2OTUzNDQ3LCJleHAiOjE3Njc1NTgyNDd9.4cyBihxAKXwl5KKwdxPfSoow59IHBuSGwp5VpKY_dEk', '2026-01-05 03:24:08', '2025-12-28 20:24:07'),
(124, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0YWZmIiwiaWF0IjoxNzY2OTUzNTgzLCJleHAiOjE3Njc1NTgzODN9.kG1iXgjhfE-vN_fdl2ZvPcI2WjGtZKBjZA0pc89_c8M', '2026-01-05 03:26:24', '2025-12-28 20:26:23'),
(125, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2OTUzOTI5LCJleHAiOjE3Njc1NTg3Mjl9.FiIIRDsVz0juLTIp-GwK5AV6A_3j0bJVlvj_HeaWazc', '2026-01-05 03:32:09', '2025-12-28 20:32:09'),
(126, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjY5NjYxNjIsImV4cCI6MTc2NzU3MDk2Mn0.GdD-C1BOY65OBTBppPnDdAAdYLETozqIVRGkBgYvDLA', '2026-01-05 06:56:03', '2025-12-28 23:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `address` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `open_time` time DEFAULT '08:00:00',
  `close_time` time DEFAULT '22:00:00',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `address`, `phone`, `open_time`, `close_time`, `latitude`, `longitude`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Crispc - An Hưng', 'V9-A02, Khu đô thị mới An Hưng, Phường La Khê, Quận Hà Đông, Thành phố Hà Nội', ' 0845656568', '08:00:00', '22:00:00', 20.97301300, 105.75759800, 1, '2025-12-27 09:56:36', '2025-12-28 19:34:31'),
(2, 'Crispc - Lê Văn Việt', '372 Lê Văn Việt, P.Tăng Nhơn Phú B, Q.9, TP Hồ Chí Minh', '19006008', '08:00:00', '22:00:00', 10.84799800, 106.78666100, 1, '2025-12-28 19:38:36', '2025-12-28 19:38:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_vietnamese_ci DEFAULT 'Other',
  `birthday` date DEFAULT NULL,
  `role` enum('user','admin','staff') COLLATE utf8mb4_vietnamese_ci DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `email`, `password`, `avatar`, `gender`, `birthday`, `role`, `is_active`, `created_at`, `updated_at`, `reset_token`, `reset_token_expiry`) VALUES
(2, 'Nguyễn Nghĩa  Mạnh', '0909663974', 'manhnguyen1768@gmail.com', '$2b$10$/u8IYw/m5ljtk39o5QLx7.TyudkDw3XLUcHpnvyRLCG6qC9Bmikwu', NULL, 'Other', '2025-12-25', 'user', 1, '2025-12-27 17:02:42', '2025-12-28 19:25:44', NULL, NULL),
(3, 'Bùi Văn Minh', '0972750142', 'toilaminhbui@gmail.com', '$2b$10$uYaJsvoL/4uxV7c55lyhG.bgjilSHEWRuqHOacZpRpPrp5dcutkpK', NULL, 'Female', '2016-01-21', 'staff', 1, '2025-12-28 06:59:45', '2025-12-28 20:32:00', 'b4c0ed346ed2d6c94c8c378e161cdaffbe0d0ddf5ca903a4b949773873e223d9', '2025-12-29 02:41:05'),
(4, 'Nguyễn Văn Nam', '0706708022', 'manhnguyen1745@gmail.com', '$2b$10$np0Ku74CjfFtM1qabz7BtO1ahXOXgNFFJyqzTxVJitsFuVAUcvSVK', '/uploads/1766941032030-813508931.jpg', 'Other', NULL, 'staff', 1, '2025-12-28 16:55:09', '2025-12-28 17:26:17', NULL, NULL),
(5, 'Nguyễn Trần Lâm', '0706708023', 'manhnguyen1723@gmail.com', '$2b$10$vWOd9Lzn4iRGpTjhNlN7Iu12lEBhJJugtV6nVWhD0iZaVyvNJWNE2', NULL, 'Other', NULL, 'admin', 1, '2025-12-28 16:58:52', '2025-12-28 17:15:42', NULL, NULL),
(6, 'Nguyễn Thành Nam', '0393815225', 'bluenomilbue@gmail.com', '$2b$10$MGh7urOAJt/lm263YXtVT.qCYVB.ySMG9iRiHabl71m7EPk7w6leW', NULL, 'Other', NULL, 'staff', 1, '2025-12-28 19:24:11', '2025-12-28 19:48:59', 'ce861128dd16876882d4b29307c1951e25b0b21d4767798b5f301b8dfa133f25', '2025-12-29 03:04:00'),
(7, 'Cao Ngọc Quý', '0914953685', 'rednomired@gmail.com', '$2b$10$IDmgONQljfF3dlkla4tzDucNFQpVsmbivb4GerG4Ix42KmHhfOejm', NULL, 'Other', NULL, 'user', 1, '2025-12-28 19:25:13', '2025-12-28 19:47:55', '6f20436e3699993ce98ceb2fa7b198a6bbc76a27928ba31c26fe241383899982', '2025-12-29 03:02:55'),
(8, 'Viên Ngọc Quý', ' 0845656568', 'blacknomiblack@gmail.com', '$2b$10$XyA6msz56L1A2Z26Bx1e5uCWF5a5E3hLOPFDLTZd6MJ8/PoyA7LGO', NULL, 'Other', NULL, 'user', 1, '2025-12-28 19:29:25', '2025-12-28 19:29:25', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `address_name` varchar(100) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `full_address` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `recipient_name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `recipient_email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `recipient_phone` varchar(20) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `address_name`, `full_address`, `recipient_name`, `recipient_email`, `recipient_phone`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 3, 'Nhà', 'Quận 1, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam', 'Bùi Văn Minh', 'toilaminhbui@gmail.com', '0972750142', 1, '2025-12-28 07:06:47', '2025-12-28 07:06:47'),
(2, 3, 'Trường học', 'Hồ Cảnh Quan Xã Đam Rông 2, Thôn 1, Xã Đam Rông 2, Tỉnh Lâm Đồng, Việt Nam', 'Bùi Văn Minh', 'toilaminhbui@gmail.com', '0972750142', 0, '2025-12-28 07:07:00', '2025-12-28 07:07:00'),
(3, 5, 'Công Ty ban mai', 'Hoàn Kiếm, Phuoc Hoa, Nha Trang, Khánh Hòa Province, 57124, Vietnam', 'Lâm ', 'manhnguyen1712@gmail.com', '0373123123', 1, '2025-12-28 17:03:25', '2025-12-28 17:03:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promotion_id` (`promotion_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_options`
--
ALTER TABLE `product_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `product_option_groups`
--
ALTER TABLE `product_option_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `promotion_products`
--
ALTER TABLE `promotion_products`
  ADD PRIMARY KEY (`promotion_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `product_options`
--
ALTER TABLE `product_options`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `product_option_groups`
--
ALTER TABLE `product_option_groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_options`
--
ALTER TABLE `product_options`
  ADD CONSTRAINT `product_options_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `product_option_groups` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_option_groups`
--
ALTER TABLE `product_option_groups`
  ADD CONSTRAINT `product_option_groups_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promotion_products`
--
ALTER TABLE `promotion_products`
  ADD CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promotion_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

