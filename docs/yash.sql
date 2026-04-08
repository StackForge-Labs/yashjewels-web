/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `yash_gems_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `yash_gems_db`;

CREATE TABLE IF NOT EXISTS `api_partners` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `company_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `plan` int NOT NULL,
  `daily_quota` int NOT NULL,
  `api_key_hash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `webhook_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` int NOT NULL,
  `last_rotated_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `api_partners`;

CREATE TABLE IF NOT EXISTS `api_usage_logs` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `partner_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `endpoint` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `request_count` int NOT NULL,
  `log_date` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `api_usage_logs`;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `actor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `actor_role` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `action` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entity_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entity_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `old_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `new_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ip_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `user_agent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `audit_logs`;

CREATE TABLE IF NOT EXISTS `brands` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `logo_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `brands`;

CREATE TABLE IF NOT EXISTS `carts` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `carts`;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `cart_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `gold_rate_at_add` decimal(65,30) NOT NULL,
  `calculated_mrp_at_add` decimal(65,30) NOT NULL,
  `is_gift` tinyint(1) NOT NULL,
  `gift_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `cart_items`;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `slug` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `parent_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `icon_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `sort_order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `categories`;

CREATE TABLE IF NOT EXISTS `certifications` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `cert_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `certifications`;

CREATE TABLE IF NOT EXISTS `commission_ledger` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `from_vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `to_vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `amount` decimal(65,30) NOT NULL,
  `commission_rate` decimal(65,30) NOT NULL,
  `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `approved_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `commission_ledger`;

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `discount_type` int NOT NULL,
  `discount_value` decimal(65,30) NOT NULL,
  `min_order_amount` decimal(65,30) DEFAULT NULL,
  `max_uses_total` int DEFAULT NULL,
  `used_count` int NOT NULL,
  `valid_from` datetime(6) NOT NULL,
  `valid_until` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `coupons`;

CREATE TABLE IF NOT EXISTS `coupon_usages` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `coupon_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `used_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `coupon_usages`;

CREATE TABLE IF NOT EXISTS `delivery_incidents` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `shipment_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `reported_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `incident_type` int NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `evidence_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `resolution` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `delivery_incidents`;

CREATE TABLE IF NOT EXISTS `diamond_qualities` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `grade_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `diamond_qualities`;

CREATE TABLE IF NOT EXISTS `diamond_sub_types` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `diamond_quality_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `sub_type_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `diamond_sub_types`;

CREATE TABLE IF NOT EXISTS `gold_karats` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `carat_label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `purity_pct` decimal(65,30) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `gold_karats`;

CREATE TABLE IF NOT EXISTS `gold_price_histories` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `gold_rate_vnd` decimal(65,30) NOT NULL,
  `gold_rate_per_gm` decimal(65,30) NOT NULL,
  `source` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `recorded_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `gold_price_histories`;

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `inquiries`;

CREATE TABLE IF NOT EXISTS `insurance_claims` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `claimant_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `claim_type` int NOT NULL,
  `incident_date` datetime(6) NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `evidence_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `claimed_amount` decimal(65,30) NOT NULL,
  `status` int NOT NULL,
  `approved_amount` decimal(65,30) DEFAULT NULL,
  `reviewed_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `review_note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `insurance_claims`;

CREATE TABLE IF NOT EXISTS `insurance_policies` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` int NOT NULL,
  `rate_pct` decimal(65,30) NOT NULL,
  `coverage_days` int NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `insurance_policies`;

CREATE TABLE IF NOT EXISTS `inventory_locks` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `locked_by_user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `locked_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `released_at` datetime(6) DEFAULT NULL,
  `release_reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `inventory_locks`;

CREATE TABLE IF NOT EXISTS `invoices` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `invoice_number` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `customer_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `buyer_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `buyer_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `total_amount` decimal(65,30) NOT NULL,
  `pdf_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `version` int NOT NULL,
  `issued_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `invoices`;

CREATE TABLE IF NOT EXISTS `invoice_reissue_requests` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `invoice_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `requested_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `change_note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `cccd_verify_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `reissued_invoice_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `reviewed_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `reject_reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `invoice_reissue_requests`;

CREATE TABLE IF NOT EXISTS `jewel_types` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `jewel_types`;

CREATE TABLE IF NOT EXISTS `kyc_verifications` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `cccd_front_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cccd_back_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cccd_number` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `face_selfie_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `face_match_score` decimal(65,30) DEFAULT NULL,
  `liveness_passed` tinyint(1) DEFAULT NULL,
  `status` int NOT NULL,
  `reviewed_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `reject_reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `attempt_number` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `kyc_verifications`;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_number` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `customer_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `shipping_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shipping_phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gold_rate_snapshot` decimal(65,30) NOT NULL,
  `total_amount` decimal(65,30) NOT NULL,
  `idempotency_key` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `status` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_orders_user_id` (`user_id`),
  CONSTRAINT `FK_orders_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `orders`;

CREATE TABLE IF NOT EXISTS `order_contact_logs` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `attempt_number` int NOT NULL,
  `contact_method` int NOT NULL,
  `contacted_at` datetime(6) NOT NULL,
  `result` int NOT NULL,
  `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `order_contact_logs`;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `style_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gold_rate_snapshot` decimal(65,30) NOT NULL,
  `unit_price` decimal(65,30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `order_items`;

CREATE TABLE IF NOT EXISTS `otp_verifications` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `target` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` int NOT NULL,
  `otp_hash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `attempts` int NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `otp_verifications`;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `payment_type` int NOT NULL,
  `amount` decimal(65,30) NOT NULL,
  `currency` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `payment_method` int NOT NULL,
  `gateway` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gateway_transaction_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `gateway_status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` int NOT NULL,
  `refunded_amount` decimal(65,30) NOT NULL,
  `refunded_at` datetime(6) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `payments`;

CREATE TABLE IF NOT EXISTS `points_ledger` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `points` int NOT NULL,
  `type` int NOT NULL,
  `ref_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `points_ledger`;

CREATE TABLE IF NOT EXISTS `post_purchase_service_requests` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `customer_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `service_type` int NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` int NOT NULL,
  `result_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `scheduled_date` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `post_purchase_service_requests`;

CREATE TABLE IF NOT EXISTS `products` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `style_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `brand_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `category_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_type_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `jewel_type_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `gold_karat_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `certification_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `gold_weight_gm` decimal(65,30) NOT NULL,
  `net_gold_gm` decimal(65,30) NOT NULL,
  `wastage_pct` decimal(65,30) NOT NULL,
  `gold_making_charge` decimal(65,30) NOT NULL,
  `quantity` int NOT NULL,
  `row_version` bigint NOT NULL,
  `status` int NOT NULL,
  `view_count` int NOT NULL,
  `sold_count` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `products`;

CREATE TABLE IF NOT EXISTS `product_diamonds` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `diamond_quality_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `carat` decimal(65,30) NOT NULL,
  `pieces` int NOT NULL,
  `rate_per_carat` decimal(65,30) NOT NULL,
  `total_amount` decimal(65,30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `product_diamonds`;

CREATE TABLE IF NOT EXISTS `product_images` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `image_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alt_text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_primary` tinyint(1) NOT NULL,
  `sort_order` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `product_images`;

CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `rating` int NOT NULL,
  `comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `verified_purchase` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `product_reviews`;

CREATE TABLE IF NOT EXISTS `product_stones` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `stone_quality_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `pieces` int NOT NULL,
  `weight_per_gm` decimal(65,30) NOT NULL,
  `carat` decimal(65,30) NOT NULL,
  `rate_per_piece` decimal(65,30) NOT NULL,
  `total_amount` decimal(65,30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `product_stones`;

CREATE TABLE IF NOT EXISTS `product_types` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `product_types`;

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `token_hash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ip_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `expires_at` datetime(6) NOT NULL,
  `rotated_at` datetime(6) DEFAULT NULL,
  `revoked_at` datetime(6) DEFAULT NULL,
  `revoke_reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_refresh_tokens_user_id` (`user_id`),
  CONSTRAINT `FK_refresh_tokens_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `refresh_tokens`;

CREATE TABLE IF NOT EXISTS `return_requests` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `customer_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `evidence_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `refund_amount` decimal(65,30) DEFAULT NULL,
  `refund_method` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` int NOT NULL,
  `vendor_note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `admin_note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `reviewed_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `return_requests`;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `roles`;

CREATE TABLE IF NOT EXISTS `shipments` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `carrier` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tracking_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `shipping_fee` decimal(65,30) NOT NULL,
  `estimated_delivery` datetime(6) DEFAULT NULL,
  `delivery_photo_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `shipments`;

CREATE TABLE IF NOT EXISTS `spin_wheel_prizes` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `prize_type` int NOT NULL,
  `prize_value` decimal(65,30) NOT NULL,
  `probability` decimal(65,30) NOT NULL,
  `color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `spin_wheel_prizes`;

CREATE TABLE IF NOT EXISTS `spin_wheel_results` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `prize_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `coupon_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `spun_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `spin_wheel_results`;

CREATE TABLE IF NOT EXISTS `stone_qualities` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `stone_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `stone_qualities`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `first_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `date_of_birth` datetime(6) DEFAULT NULL,
  `status` int NOT NULL,
  `google_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `oauth_provider` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `two_fa_enabled` tinyint(1) NOT NULL,
  `two_fa_secret` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `last_login_at` datetime(6) DEFAULT NULL,
  `email_verified_at` datetime(6) DEFAULT NULL,
  `phone_verified_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `users`;
INSERT INTO `users` (`id`, `email`, `phone`, `password`, `first_name`, `last_name`, `avatar_url`, `date_of_birth`, `status`, `google_id`, `oauth_provider`, `two_fa_enabled`, `two_fa_secret`, `last_login_at`, `email_verified_at`, `phone_verified_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
	('87c3462c-7122-4c89-a2d6-bbc79e563c93', 'string', NULL, '$2a$12$N04iJ9xzonzXwKSQaYi5dOe.grDcfKD/C5TaMsLQ0R.vAVbBph1t6', 'string', 'string', NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, '2026-04-07 15:08:03.827441', '2026-04-07 15:08:03.827480', NULL);

CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `recipient_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `recipient_phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address_line1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ward` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `district` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `province` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_user_addresses_user_id` (`user_id`),
  CONSTRAINT `FK_user_addresses_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `user_addresses`;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `role_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `granted_at` datetime(6) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `i_x_user_roles_role_id` (`role_id`),
  CONSTRAINT `FK_user_roles_roles_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_roles_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `user_roles`;

CREATE TABLE IF NOT EXISTS `vendors` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `parent_vendor_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `vendor_level` int NOT NULL,
  `business_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `business_license_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `tax_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `commission_rate` decimal(65,30) NOT NULL,
  `max_sub_vendors` int NOT NULL,
  `business_kyc_status` int NOT NULL,
  `status` int NOT NULL,
  `approved_by` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `sla_violation_count` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `vendors`;

CREATE TABLE IF NOT EXISTS `warranty_registrations` (
  `id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `order_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `product_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `customer_id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `warranty_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `warranty_start_date` datetime(6) NOT NULL,
  `warranty_end_date` datetime(6) NOT NULL,
  `status` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `warranty_registrations`;

CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `__efmigrationshistory`;
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
	('20260407143923_InitialCreate', '8.0.10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
