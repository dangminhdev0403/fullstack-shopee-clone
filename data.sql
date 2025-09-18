-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: shopee_clone
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address_detail` varchar(255) DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `province_id` bigint DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `ward_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `full_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (14,'2025-08-13 21:24:27.691019','Minh','test 12111',1456,0x00,'0343921331',216,'home',21509,1,'test 12111, Phường Tân Thành, Quận Tân Phú, Đồng Tháp'),(16,'2025-08-24 08:29:51.430412','Đặng Minh','1231ok',1454,0x01,'0343921331',212,'home',21209,1,'1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang'),(17,'2025-08-24 18:36:03.976945','Minh','test 121',1455,0x00,'0343921331',213,'home',21410,1,'test 121, Phường 10, Quận Tân Bình, Bến Tre'),(18,'2025-08-24 18:43:30.163256','Minh','test 121',1456,0x00,'0343921331',214,'home',21509,1,'test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh'),(19,'2025-09-12 21:00:37.085065','Minh','11',1455,0x01,'0343921331',214,'home',21411,5,'11, Phường 11, Quận Tân Bình, Trà Vinh'),(20,'2025-09-13 10:45:33.651298','Minh','Hoà Bình',1452,0x01,'0343921331',201,'home',21008,14,'Hoà Bình, Phường 8, Quận 10, Hà Nội');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;

--
-- Table structure for table `cart_details`
--

DROP TABLE IF EXISTS `cart_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkcochhsa891wv0s9wrtf36wgt` (`cart_id`),
  KEY `FK9rlic3aynl3g75jvedkx84lhv` (`product_id`),
  CONSTRAINT `FK9rlic3aynl3g75jvedkx84lhv` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKkcochhsa891wv0s9wrtf36wgt` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_details`
--

/*!40000 ALTER TABLE `cart_details` DISABLE KEYS */;
INSERT INTO `cart_details` VALUES (69,1,4,7),(70,1,4,13),(165,1,5,14),(169,1,5,8),(170,1,5,19);
/*!40000 ALTER TABLE `cart_details` ENABLE KEYS */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (2,1),(4,5),(5,14);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (3,'2025-05-19 23:45:51.112610','Máy Tính'),(4,'2025-05-19 23:45:51.118128','Đồng Hồ'),(5,'2025-05-19 23:45:51.121130','Linh kiện'),(6,'2025-05-19 23:45:51.123127','Sức khoẻ'),(7,'2025-05-19 23:45:51.124632','Quần áo'),(8,'2025-05-19 23:45:51.126638','Gia dụng'),(9,'2025-05-19 23:45:51.129146','Thời trang'),(10,'2025-05-19 23:45:51.130145','Điện Thoại'),(11,'2025-05-19 23:45:51.132144','Sách'),(12,'2025-05-19 23:45:51.133145','Dụng cụ học tập');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` bigint NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `shop_status` enum('CANCELED','DELIVERED','PENDING','PROCESSING','RETURNED','SHIPPING') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FK4q98utpd73imf4yhttm3w0eax` (`product_id`),
  CONSTRAINT `FK4q98utpd73imf4yhttm3w0eax` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (26,8765923.00,5,24,7,'DELIVERED'),(27,9456043.00,5,24,8,'DELIVERED'),(28,6180283.00,1,24,6,'PENDING'),(29,2331525.00,1,24,18,'SHIPPING'),(30,8765923.00,1,25,7,'DELIVERED'),(31,5826741.00,1,25,23,'DELIVERED'),(32,9456043.00,1,26,8,'DELIVERED'),(33,6293611.00,1,27,12,'PENDING'),(34,2331525.00,1,28,18,'PENDING'),(35,8765923.00,1,29,7,'PENDING'),(36,8765923.00,1,30,7,'RETURNED'),(37,7271798.00,1,31,17,'DELIVERED'),(38,8765923.00,1,32,7,'DELIVERED'),(39,9456043.00,20,33,8,'PENDING'),(40,8765923.00,2,34,7,'DELIVERED'),(41,2331525.00,1,34,18,'DELIVERED'),(42,9456043.00,1,34,8,'PENDING'),(43,9456043.00,1,35,8,'SHIPPING'),(44,6252087.00,1,35,13,'PENDING'),(45,2331525.00,1,35,18,'DELIVERED'),(46,8765923.00,1,36,7,'DELIVERED'),(47,2331525.00,1,37,18,'PENDING'),(48,6180283.00,1,38,6,'DELIVERED'),(49,1778166.00,2,39,5,'DELIVERED'),(50,2.00,1,39,60,'PENDING'),(51,6180283.00,3,40,6,'DELIVERED'),(52,6180283.00,3,41,6,'PENDING'),(53,6293611.00,1,42,12,'PENDING'),(54,6293611.00,1,43,12,'PENDING'),(55,8765923.00,1,44,7,'PENDING'),(56,6180283.00,1,45,6,'DELIVERED'),(57,8765923.00,1,46,7,'DELIVERED'),(58,6293611.00,1,47,12,'DELIVERED'),(59,6180283.00,4,48,6,'PENDING'),(60,6180283.00,1,49,6,'PENDING'),(61,7437532.00,2,50,11,'DELIVERED'),(62,8765923.00,1,51,7,'PENDING'),(63,8765923.00,1,52,7,'SHIPPING'),(64,6180283.00,3,53,6,'SHIPPING'),(65,6180283.00,3,54,6,'DELIVERED'),(66,6180283.00,3,55,6,'PENDING'),(67,6180283.00,1,56,6,'DELIVERED'),(69,8765923.00,2,58,7,'DELIVERED'),(72,6293611.00,1,61,12,'PENDING'),(73,8765923.00,1,62,7,'DELIVERED'),(75,6180283.00,1,64,6,'PENDING'),(77,8765923.00,1,66,7,'DELIVERED'),(85,6180283.00,4,71,6,'PENDING'),(86,1778166.00,3,72,5,'SHIPPING'),(110,9456043.00,1,86,8,'PENDING'),(129,6252087.00,1,101,13,'PENDING'),(149,9456043.00,1,114,8,'PENDING'),(150,2285402.00,1,114,9,'PENDING');
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `receiver_address` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(255) DEFAULT NULL,
  `status` enum('CANCELED','DELIVERED','PENDING','PROCESSING','RETURNED','SHIPPING') DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `payment_method` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_chk_1` CHECK ((`payment_method` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (24,'2025-08-19 21:30:41.689412','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PROCESSING',1,'SP20250820-23420C',99621638.00,NULL),(25,'2025-08-23 17:11:24.924924','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PROCESSING',1,'SP20250824-BBEC50',14592664.00,NULL),(26,'2025-08-23 17:13:32.727408','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PENDING',1,'SP20250824-4CCF64',9456043.00,NULL),(27,'2025-08-23 17:30:22.215175','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PENDING',1,'SP20250824-9E8813',6293611.00,NULL),(28,'2025-08-23 17:32:50.731345','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PENDING',1,'SP20250824-193B73',2331525.00,NULL),(29,'2025-08-23 17:34:00.994324','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PROCESSING',1,'SP20250824-5CFEB2',8799923.00,NULL),(30,'2025-08-23 17:35:14.721610','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','RETURNED',1,'SP20250824-A14DC0',8765923.00,NULL),(31,'2025-08-23 17:35:26.670580','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','PENDING',1,'SP20250824-F187D5',7271798.00,NULL),(32,'2025-08-23 17:36:42.061232','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','RETURNED',1,'SP20250824-5DC953',8765923.00,NULL),(33,'2025-08-23 17:58:39.702215','Hoà Bình, Phường 5, Quận 11, Long An','Minh','0343921331','RETURNED',1,'SP20250824-D181AD',189120860.00,NULL),(34,'2025-09-12 21:00:50.511646','11, Phường 11, Quận Tân Bình, Trà Vinh','Minh','0343921331','PENDING',5,'SP20250913-E47BBD',29353414.00,NULL),(35,'2025-09-12 21:10:01.597380','11, Phường 11, Quận Tân Bình, Trà Vinh','Minh','0343921331','PROCESSING',5,'SP20250913-F93BF5',18039655.00,NULL),(36,'2025-09-12 21:11:14.102995','11, Phường 11, Quận Tân Bình, Trà Vinh','Minh','0343921331','PENDING',5,'SP20250913-BB81D6',8799923.00,NULL),(37,'2025-09-12 21:11:37.026288','11, Phường 11, Quận Tân Bình, Trà Vinh','Minh','0343921331','PENDING',5,'SP20250913-FE00A4',2365525.00,NULL),(38,'2025-09-13 00:27:15.106186','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-43907B',6214283.00,1),(39,'2025-09-13 00:34:52.827096','123 Đường ABC, Quận 1, TP.HCM','Nguyễn Văn A','0912345678','PENDING',1,'SP20250913-D1C580',3566334.00,0),(40,'2025-09-13 00:51:59.140041','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-2B6988',18574849.00,0),(41,'2025-09-13 00:52:25.184820','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-9AA06D',18574849.00,0),(42,'2025-09-13 00:54:01.802796','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-5DF64C',6327611.00,0),(43,'2025-09-13 00:56:05.709842','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-9AB2AD',6327611.00,0),(44,'2025-09-13 00:56:34.006238','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-91F7C3',8799923.00,0),(45,'2025-09-13 00:58:14.263273','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-B921D6',6214283.00,1),(46,'2025-09-13 01:04:07.113700','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-A1A347',8799923.00,0),(47,'2025-09-13 01:04:16.860546','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-38A842',6327611.00,1),(48,'2025-09-13 01:10:50.403324','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-D0F722',24755132.00,1),(49,'2025-09-13 01:11:09.194593','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-E0D0CA',6214283.00,0),(50,'2025-09-13 01:11:22.261280','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-C4BFCA',14909064.00,1),(51,'2025-09-13 01:17:37.014357','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-581D15',8799923.00,1),(52,'2025-09-13 01:20:38.410524','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','SHIPPING',1,'SP20250913-7F98A4',8765923.00,1),(53,'2025-09-13 01:21:26.740451','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','SHIPPING',1,'SP20250913-DE84DF',18540849.00,1),(54,'2025-09-13 01:29:22.198707','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-49B5E0',18574849.00,1),(55,'2025-09-13 01:38:55.302262','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-9156F4',18574849.00,1),(56,'2025-09-13 01:39:38.895720','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-C37DE1',6214283.00,1),(58,'2025-09-13 01:57:34.781857','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-026B76',17565846.00,1),(61,'2025-09-13 02:07:13.575828','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-989223',6327611.00,0),(62,'2025-09-13 02:07:27.316351','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-2DAAB4',8799923.00,1),(64,'2025-09-13 02:11:15.464625','test 121, Phường Tân Thành, Quận Tân Phú, Trà Vinh','Minh','0343921331','PENDING',1,'SP20250913-F30365',6214283.00,0),(66,'2025-09-13 02:12:17.460554','1231ok, Phường Thạnh Xuân, Quận 12, Tiền Giang','Đặng Minh','0343921331','PENDING',1,'SP20250913-D7CD16',8799923.00,0),(71,'2025-09-13 10:48:09.469976','Hoà Bình, Phường 8, Quận 10, Hà Nội','Minh','0343921331','CANCELED',14,'SP20250913-7A3D5A',24755132.00,0),(72,'2025-09-13 10:50:13.109711','Hoà Bình, Phường 8, Quận 10, Hà Nội','Minh','0343921331','SHIPPING',14,'SP20250913-1809A3',5334498.00,0),(86,'2025-09-14 04:53:24.734297','Hoà Bình, Phường 8, Quận 10, Hà Nội','Minh','0343921331','PENDING',14,'SP20250914-9E627B',9490043.00,0),(101,'2025-09-14 06:22:52.433656','Hoà Bình, Phường 8, Quận 10, Hà Nội','Minh','0343921331','PENDING',14,'SP20250914-BB5AFE',6286087.00,0),(114,'2025-09-14 06:47:46.167320','Hoà Bình, Phường 8, Quận 10, Hà Nội','Minh','0343921331','PENDING',14,'SP20250914-3651AB',11775445.00,0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descrition` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'Xoá vai trò','DELETE','/api/v1/admin/roles'),(5,'Tạo người dùng','POST','/api/v1/admin/users'),(12,'Tạo vai trò','POST','/api/v1/admin/roles'),(14,'Lấy vai trò theo ID','GET','/api/v1/admin/roles/{id}'),(24,'Lấy danh sách các quyền','GET','/api/v1/admin/permissions'),(27,'getPermission','GET','/api/v1/admin/permissions/{id}'),(28,'putMethodName','PUT','/api/v1/admin/roles'),(29,'Lấy danh sách các vai trò','GET','/api/v1/admin/roles'),(32,'Tìm kiếm người dùng theo từ khoá','GET','/api/v1/admin/users/search'),(33,'Tạo danh sách danh mục','POST','/api/v1/admin/categories'),(34,'Xoá danh mục','DELETE','/api/v1/admin/categories'),(35,'Sửa danh mục','PUT','/api/v1/admin/categories'),(36,'Lấy danh sách danh mục','GET','/api/v1/admin/categories'),(52,'Cập nhật trạng thái cửa hàng','PUT','/api/v1/admin/shops/update-status'),(54,'Cập nhật thông tin cửa hàng','PUT','/api/v1/admin/shops/update'),(55,'Lấy danh sách đơn hàng','GET','/api/v1/admin/shops/orders'),(57,'Cập nhật  đơn hàng','PUT','/api/v1/admin/shops/orders'),(61,'Lấy danh sách sản phẩm','GET','/api/v1/admin/products'),(64,'Tạo mới sản phẩm','POST','/api/v1/admin/products'),(65,'Cập nhật sản phẩm','PUT','/api/v1/admin/products'),(66,'Tạo danh sách sản phẩm từ file Excel','POST','/api/v1/admin/products/import'),(72,'Lấy hình ảnh sản phẩm','GET','/api/v1/admin/products/images/{id}'),(75,'getAnalytics','GET','/api/v1/admin/analytics/product-overview'),(79,'Lấy danh sách đơn hàng','GET','/api/v1/admin/orders'),(82,'Lấy danh sách trạng thái đơn hàng','GET','/api/v1/admin/orders/statuses'),(86,'Lấy báo cáo doanh thu','GET','/api/v1/admin/orders/overview'),(92,'Cập nhật đơn hàng','PUT','/api/v1/admin/orders'),(95,'getMethodName','GET','/api/v1/admin/analytics/common-analytics'),(99,'getWeeklyData','GET','/api/v1/admin/analytics/weekly-data');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` longtext,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683292/products/wafvakrel9r1n3icrqox.jpg',5),(2,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683293/products/yqnn5gavs9jkointo0bx.jpg',5),(3,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683294/products/qcj1gtqycm1xp0ccodua.png',5),(4,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683295/products/mmbemhrn7tqwlngtovtb.webp',6),(5,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683296/products/lfompjafsxmi3nvrd2tl.jpg',7),(6,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683297/products/rvujm48ho0nta1gp3g1q.webp',7),(7,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683298/products/xk8qynfalxnclenkkuwt.jpg',8),(8,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683300/products/ktq0gn8mqxs6ven5pips.jpg',8),(9,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683301/products/itgcnxltc03tiowg1q8v.webp',8),(10,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683302/products/hhjnlzub3onjrql8tij1.jpg',9),(11,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683303/products/pm4ffdveuman5q7iryzd.webp',9),(12,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683304/products/uj9emoru43uin43wwdvf.webp',10),(13,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683305/products/xwh2chxrkfq7pyxxyiq6.webp',10),(14,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683306/products/kyfi99xh05u0jbp5asca.jpg',11),(15,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683307/products/zwyunw0bykpuhpimmxoe.webp',11),(16,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683308/products/xsmu6nqj19vg8puhoji3.jpg',12),(17,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683309/products/aovvpmyu5fewytncamqy.jpg',12),(18,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683310/products/ks3t50irbvbkiemdq4ru.webp',12),(19,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683996/products/cttotj6zqr08thewwjus.webp',13),(20,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683997/products/wtznekmrdgoizdmvhut2.webp',13),(21,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683998/products/oz3ynmvobgsw9odhqw6p.webp',13),(22,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747683999/products/p7pdfjymwrpo9eianspb.webp',14),(23,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684000/products/upw4jhua0jdiyck1jpmr.webp',14),(24,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684001/products/odczs9ozfvveutq0qt4r.webp',15),(25,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684002/products/keb9wjh7sqtthfngehns.webp',15),(26,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684003/products/tkcwttj9cwelptbamvrs.webp',15),(27,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684004/products/foleujtdsv88sikoxmlx.webp',16),(28,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684005/products/czxdtumlwitviarnmecg.webp',16),(29,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684006/products/a5yhhlur3fhumvng2zrx.webp',16),(30,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684007/products/os8j47bky5i08qrvhwn4.webp',17),(31,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684008/products/a1v7hjxulurwr2feq1um.webp',17),(32,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684009/products/bzmjablslbroti1pyo38.webp',17),(33,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684010/products/y3gvcj0n6fwucwpzibmw.webp',18),(34,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684011/products/orf7j476g4htsgxmbhvz.webp',18),(35,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684012/products/s0ittojhg59kzystqlio.webp',18),(36,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684013/products/bs8uspiqfs9lsxmc81gc.webp',19),(37,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684549/products/gbf8eawhm4ufxixhha9b.webp',20),(38,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684550/products/kmsjqvhiq6akzfirtza3.webp',21),(39,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684551/products/hzt2hmbywz5errsy1m47.webp',21),(40,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684552/products/n30bakvzlbtvf8bsteta.webp',21),(41,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684553/products/yf6ks3jnslx8l4f003lk.webp',22),(42,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684554/products/ml63qhlgydylcokhcdry.webp',22),(43,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684555/products/xxrad8m3mubqvygtqzkr.webp',23),(44,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684556/products/hwfk99viihjx7eyblrcx.webp',23),(45,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684557/products/a0nv0w1coubabmtqip1v.webp',24),(46,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684558/products/igzoi5cccfxbobtauoaw.webp',24),(47,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684559/products/xdcishjo7kxo0je622we.webp',24),(48,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684560/products/lympb4uprsb043nqwptx.jpg',25),(49,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684561/products/rhaodbqu9ul8xrt27mnu.jpg',25),(50,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684562/products/a17blqbwfpprtnpy65xp.webp',26),(51,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1747684563/products/umuvqt2zviqupxmaccgx.webp',26),(83,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1757498655/products/abmkrfaaw8zti9alzp0v.jpg',57),(84,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1757498688/products/f9klm28tpfzmmy3rd4bz.jpg',58),(85,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1757498688/products/f9klm28tpfzmmy3rd4bz.jpg',58),(89,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1757499312/products/wcomulipmcbzuhryc3wj.jpg',59),(96,'https://res.cloudinary.com/dwjqosrrk/image/upload/v1757500655/products/wwo7vwlo6ohmdjwju7fs.jpg',60);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `shop_id` bigint DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  KEY `FK7kp8sbhxboponhx3lxqtmkcoj` (`shop_id`),
  CONSTRAINT `FK7kp8sbhxboponhx3lxqtmkcoj` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (5,'2025-05-20 09:43:28.177257','iPhone 16 512GB','iPhone 16 512GB',1778166.00,17,5,3,'INACTIVE'),(6,'2025-05-20 09:43:28.226465','minh','Điện Thoại iPhone 11 128GB Xanh Lá',6180283.00,1000,3,3,'ACTIVE'),(7,'2025-05-20 09:43:28.230466','Điện Thoại iPhone 13 Pro 128GB','Điện Thoại iPhone 13 Pro 128GB',8765923.00,3,10,3,'ACTIVE'),(8,'2025-05-20 09:43:28.234017','Điện thoại iPhone 14 Pro Max 512GB','Điện thoại iPhone 14 Pro Max 512GB',9456043.00,3,10,3,'ACTIVE'),(9,'2025-05-20 09:43:28.238511','Điện Thoại OPPO A17','Điện Thoại OPPO A17',2285402.00,10,10,3,'ACTIVE'),(10,'2025-05-20 09:43:28.240505','Điện Thoại Samsung Galaxy A14 5G','Điện Thoại Samsung Galaxy A14 5G',7781064.00,10,10,3,'ACTIVE'),(11,'2025-05-20 09:43:28.244061','Điện Thoại Samsung Galaxy A54 5G','Điện Thoại Samsung Galaxy A54 5G',7437532.00,10,10,3,'ACTIVE'),(12,'2025-05-20 09:43:28.246058','Điện thoại Xiaomi Redmi Note 11','Điện thoại Xiaomi Redmi Note 11',6293611.00,10,10,3,'ACTIVE'),(13,'2025-05-20 09:43:28.248076','Bộ Quần Áo Thể Thao Nam Mùa Hè','Bộ Quần Áo Thể Thao Nam Mùa Hè',6252087.00,6,7,3,'ACTIVE'),(14,'2025-05-20 09:43:28.249074','Bộ Scrubs bác sĩ Minh Minh hàng cao cấp','Bộ Scrubs bác sĩ Minh Minh hàng cao cấp',90000.00,7,7,3,'ACTIVE'),(15,'2025-05-20 09:43:28.253485','BỘ SHORT NỮ THUN COTTON ÁO THÊU CHỮ','BỘ SHORT NỮ THUN COTTON ÁO THÊU CHỮ',3923869.00,7,7,3,'ACTIVE'),(16,'2025-05-20 09:43:28.255491','BỘ SHORT NỮ THUN LẠNH CAO CẤP IN 3','BỘ SHORT NỮ THUN LẠNH CAO CẤP IN 3',7545351.00,7,7,3,'ACTIVE'),(17,'2025-05-20 09:43:28.257498','Bộ thể thao nam dập vân nổi cổ bẻ phong cách hàn quốc','Bộ thể thao nam dập vân nổi cổ bẻ phong cách hàn quốc',7271798.00,6,7,3,'ACTIVE'),(18,'2025-05-20 09:43:28.259499','BỘ THỂ THAO NỮ THUN COTTON CAO CẤP QUẦN ỐNG SUÔNG','BỘ THỂ THAO NỮ THUN COTTON CAO CẤP QUẦN ỐNG SUÔNG',2331525.00,5,7,3,'ACTIVE'),(19,'2025-05-20 09:43:28.261500','vn-11134207-7r98o-lywgormrwnmp80','vn-11134207-7r98o-lywgormrwnmp80',6164584.00,7,7,3,'ACTIVE'),(20,'2025-05-20 09:43:28.265016','Bộ Cây Máy Tính Văn Phòng Chơi Game','Bộ Cây Máy Tính Văn Phòng Chơi Game',3231807.00,3,3,3,'ACTIVE'),(21,'2025-05-20 09:43:28.269013','Bộ Máy Tính AKPC-GM02','Bộ Máy Tính AKPC-GM02',3988759.00,3,3,3,'ACTIVE'),(22,'2025-05-20 09:43:28.272020','Bộ Máy Tính i3 9100F Gaming Nhẹ','Bộ Máy Tính i3 9100F Gaming Nhẹ',9317075.00,3,3,3,'ACTIVE'),(23,'2025-05-20 09:43:28.274120','Bộ PC Gaming Intel Core i5-12400F','Bộ PC Gaming Intel Core i5-12400F',5826741.00,2,3,3,'ACTIVE'),(24,'2025-05-20 09:43:28.275104','Full Bộ Máy Tính PC Core i5, i7','Full Bộ Máy Tính PC Core i5, i7',6033068.00,3,3,3,'ACTIVE'),(25,'2025-05-20 09:43:28.276103','Khái niệm về 7 phần cứng cơ bản trên mọi máy tính','Khái niệm về 7 phần cứng cơ bản trên mọi máy tính',2764186.00,3,3,3,'ACTIVE'),(26,'2025-05-20 09:43:28.278105','Laptop Gaming Lenovo Legion','Laptop Gaming Lenovo Legion',495552.00,3,3,3,'ACTIVE'),(57,'2025-09-10 09:55:53.092932','iPhone 16 512GB','',9.00,11,3,3,'ACTIVE'),(58,'2025-09-10 10:04:32.277967','iPhone 16 512GB','Điện Thoại iPhone 13 Pro 128GB',2.00,10,3,3,'ACTIVE'),(59,'2025-09-10 10:05:04.642390','Minh test ','',11.00,11,3,3,'ACTIVE'),(60,'2025-09-10 10:15:37.123381','ok','',2.00,4,3,3,'ACTIVE');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

--
-- Table structure for table `role_has_permission`
--

DROP TABLE IF EXISTS `role_has_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permission` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FK4tkb5h6g9725voio02abkw8cq` (`permission_id`),
  CONSTRAINT `FK4tkb5h6g9725voio02abkw8cq` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKl5t2ucrudh92ach6bddb918kp` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permission`
--

/*!40000 ALTER TABLE `role_has_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_has_permission` ENABLE KEYS */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'2025-08-12 15:57:03.642484','ROLE_ADMIN'),(2,'2025-08-12 15:57:03.731769','Test Role'),(3,'2025-08-12 15:57:03.735269','ROLE_USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city_id` bigint NOT NULL,
  `district_id` bigint NOT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shop_name` varchar(255) DEFAULT NULL,
  `ward_code` varchar(255) DEFAULT NULL,
  `owner_id` bigint DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6x3im56qg96va2stnwgkk7vtm` (`owner_id`),
  CONSTRAINT `FKrduswa89ayj0poad3l70nag19` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (3,201,3440,'Test','Shop ADMIN2','590710',1,'abcxyzui@gmail.com','APPROVED','0343921331');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;

--
-- Table structure for table `user_has_role`
--

DROP TABLE IF EXISTS `user_has_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_has_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKsvvq61v3koh04fycopbjx72hj` (`role_id`),
  CONSTRAINT `FK2dl1ftxlkldulcp934i3125qo` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKsvvq61v3koh04fycopbjx72hj` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_role`
--

/*!40000 ALTER TABLE `user_has_role` DISABLE KEYS */;
INSERT INTO `user_has_role` VALUES (1,1),(22,1),(5,2),(6,3),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3),(24,3),(25,3),(26,3);
/*!40000 ALTER TABLE `user_has_role` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `avatar_url` longtext,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refresh_token` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-08-10 04:11:07.529648','Minh12','https://res.cloudinary.com/dwjqosrrk/image/upload/v1757740483/avatar/bg5fiek8ld39hsoavwxe.png','admin@gmail.com','$2a$10$MEiu5aNb.8qtRtOZAU.imecVMYA81BAGdfqGnZNy9AtAfYzcKv7Hu','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjoiUk9MRV9VU0VSIiwiZXhwIjoxNzU4Nzc3NTQwLCJpYXQiOjE3NTgxNzI3NDAsInVzZXIiOnsiaWQiOjEsIm5hbWUiOiJNaW5oMTIiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGVzIjpbeyJpZCI6MSwibmFtZSI6IlJPTEVfQURNSU4ifV19fQ.3MqJjuyebaW838krXON0WgrhhYbn6s_uLOF5LtQZ3CTcD877JVgC1OtkvPsPH3XeC5qD-8w9Cr5OJXPG3__5Gg'),(5,'2025-08-12 16:05:01.354482','Test',NULL,'test@gmail.com','$2a$10$iU3nvQxytgeusAHsYYVAXu22dQN6d7CSl8RVF6C5bwqnW7gJcJjom','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOiJST0xFX1VTRVIiLCJleHAiOjE3NTgzMTU3MDMsImlhdCI6MTc1NzcxMDkwMywidXNlciI6eyJpZCI6NSwibmFtZSI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZXMiOlt7ImlkIjoyLCJuYW1lIjoiUk9MRV9VU0VSIn1dfX0.xcqZBK-sElApcuvlimD-XIu5IAPwXiL0x4cduKLXdmSVRyBFdw-G5s22IKmP17RS3JXRAYF5u-yN7p4aDprzuA'),(6,'2025-09-13 09:51:49.116787','Minh',NULL,'abc@gmail.com','$2a$10$zqpcRVF3XfD5pyOySsqIm.LesELsViviGJQMC2DN2a0sTMXoDY9tC',NULL),(7,'2025-09-13 09:52:05.373444','Minh',NULL,'abc123@gmail.com','$2a$10$o/p5bYzGhblJAJFKBtC.U.cQXjgA6VUpia5H00HtyZZHemj/LpBhK',NULL),(8,'2025-09-13 09:52:49.499197','Minh',NULL,'ab11c@gmail.com','$2a$10$l4sjcS2C2RVZM2dVxS496ejrRlSXL3NO7nFG8ZvqVkPPLB6o8FXTO',NULL),(9,'2025-09-13 09:55:08.990420','Minh',NULL,'ab12321c@gmail.com','$2a$10$8OvW3P4FxrTDt/gx8sq7tuX42OOIdjVXQ7QAQ0Ps.QZz/r17.IGWa',NULL),(10,'2025-09-13 09:55:51.978238','Minh',NULL,'ab123211c@gmail.com','$2a$10$AwS5oBgPDT2hutzhzMKO2.Bp7cOUxQ1ylzYTr4hfyZ2ywVT/DPPIm',NULL),(11,'2025-09-13 09:56:25.328144','Minh',NULL,'ab123213311c@gmail.com','$2a$10$jW/HhfeyGFZ6zH.bWRZLYuBwNc2sX/YesaiPxJhB4RVtLi33aQA3e',NULL),(12,'2025-09-13 10:08:29.889860','123456',NULL,'admi12412n@gmail.com','$2a$10$7wAag/LN/4c0hKvlAwPMruja5cOsODVAXjALLClSI4QXeHQQEupqG',NULL),(13,'2025-09-13 10:09:06.276306','123456',NULL,'admi112412n@gmail.com','$2a$10$Duk/czk264Qu4BIgCMFE5.V/TuJlP0Oo7y7i/IejBnBhB4ejka.8u',NULL),(14,'2025-09-13 10:16:18.843366','Đặng Minh','https://res.cloudinary.com/dwjqosrrk/image/upload/v1757760514/avatar/u6a8icvfi6kpd6wrult8.png','ad131331min@gmail.com','$2a$10$eiM0JhLL77YT79qxYQs0NOv3kgV2H.8ok1BM6AqIv/ykpe492Hg8i','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZDEzMTMzMW1pbkBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjoiUk9MRV9VU0VSIiwiZXhwIjoxNzU4NDM1NjIzLCJpYXQiOjE3NTc4MzA4MjMsInVzZXIiOnsiaWQiOjE0LCJuYW1lIjoixJDhurduZyBNaW5oIiwiZW1haWwiOiJhZDEzMTMzMW1pbkBnbWFpbC5jb20iLCJyb2xlcyI6W3siaWQiOjMsIm5hbWUiOiJST0xFX1VTRVIifV19fQ.ayS95cD72u3QSqKwZI9kEP4yndC1dL4yEyA-ZTn9VcVigWpnj67ikPQRS3JxFDqSPrXX-Ns7847HzgIva4l3Bw'),(15,'2025-09-13 10:18:11.535048','123456',NULL,'ad121131331mi1n@gmail.com','$2a$10$GG7Ind09gaeCqX43wFCWh.dAmjSbkfDdDgurq8oE0W6jv7khHSLyi',NULL),(16,'2025-09-13 10:18:24.138145','123456',NULL,'ad131331mi1n@gmail.com','$2a$10$p7OuHQtpeXqcjcYQLhpVReknsrqUxmCuicL8Z8qxeVqjB0mM7xXzu',NULL),(17,'2025-09-13 10:18:51.563031',' Minh',NULL,'ad1min21@gmail.com','$2a$10$.DF.PLsqWtxw6mQR8FoDG.4CZEZSeQt7Ns3WA44zbwSi1V5x4UODC',NULL),(18,'2025-09-13 10:20:33.969771',' Minh',NULL,'ad1min1221@gmail.com','$2a$10$losNDIXGFpy0SiIykfJmYevInT1A2Ukqm5EOk0Udu6SiFDvVDC/XK',NULL),(19,'2025-09-13 10:20:44.287738',' Minh',NULL,'ad313min@gmail.com','$2a$10$ZtwhSPD28R7z3DN.w.x99emJpBkdx.KFOcJr/qrCrqsmAxPLBa6C.',NULL),(20,'2025-09-13 10:21:11.284038','Minh',NULL,'adm3131in@gmail.com','$2a$10$HHjDay..vE8dTeDW6imkRuaEth/tTrR74j8p71VHqCx2htW475d8C',NULL),(21,'2025-09-13 10:21:21.299801','Minh',NULL,'ad1m31311in@gmail.com','$2a$10$s6gXtSyaKZSV/bfz1/q//u6gmJLelknDZW/hNnwVBpvAUN40JXgZW',NULL),(22,'2025-09-13 10:22:25.135105','Minh',NULL,'ad11m31311in@gmail.com','$2a$10$8uene1TISrruXU665BmDfOX4KrF70tbzvtlw45AMlf2H88Du38m3W',NULL),(23,'2025-09-13 10:22:53.790614',' Minh',NULL,'ad313mi1n@gmail.com','$2a$10$4gDuV7v.P4aHXgWmbpEMYeLBpA2td2NVhuVRomxv6azq9zfyTH6Cu',NULL),(24,'2025-09-13 10:24:14.721857','Minh',NULL,'ad11m311in@gmail.com','$2a$10$QFlSbH87z4Cz0uhGcg9.DeWzk1.XzgAxTslP5pAo1UGKBIu1yqU9.',NULL),(25,'2025-09-13 10:24:27.973935','123456',NULL,'ad11min@gmail.com','$2a$10$18wBQXvMpoLzZJzoItRjReGyamhwSnoKxMQh0dxOhjPr1cXb5jyy.',NULL),(26,'2025-09-13 10:30:33.155689','Minh',NULL,'ad111313mi1n@gmail.com','$2a$10$S5j6BtqEnLpn1qZc8M05n.zVpMlZAEN2a62J3Ima0aPjn68B.IKVq',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'shopee_clone'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-18 21:27:12
