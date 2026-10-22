-- =======================================================
-- Database Schema for Sanjai B Personal Portfolio Website
-- Compatible with MySQL 8.0+ / MariaDB 10.4+ (XAMPP & Shared Hosting)
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- =======================================================

CREATE DATABASE IF NOT EXISTS `sanjai_portfolio` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sanjai_portfolio`;

-- 1. Admin Users Table (Secure login with password_hash)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `failed_login_attempts` INT NOT NULL DEFAULT 0,
  `last_failed_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Profile Table (Personal Bio, Contact, SEO & Social Links)
CREATE TABLE IF NOT EXISTS `profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `hero_description` TEXT NOT NULL,
  `about_heading` VARCHAR(150) NOT NULL,
  `degree` VARCHAR(150) NOT NULL,
  `institution` VARCHAR(150) NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `about_description` TEXT NOT NULL,
  `career_objective` TEXT NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `linkedin_url` VARCHAR(255) NOT NULL,
  `github_url` VARCHAR(255) NOT NULL,
  `profile_image` VARCHAR(255) DEFAULT '/uploads/profile.jpg',
  `resume_path` VARCHAR(255) DEFAULT '/uploads/Sanjai_B_Resume.pdf',
  `meta_title` VARCHAR(255) NOT NULL,
  `meta_description` TEXT NOT NULL,
  `meta_keywords` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` ENUM('technical', 'academic', 'soft') NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `icon_class` VARCHAR(50) NOT NULL,
  `proficiency` INT NOT NULL DEFAULT 85,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Web & Software',
  `icon_class` VARCHAR(50) NOT NULL DEFAULT 'fas fa-laptop-code',
  `description` TEXT NOT NULL,
  `technologies` VARCHAR(255) NOT NULL,
  `project_url` VARCHAR(255) NULL,
  `github_url` VARCHAR(255) NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Research & Academic Activities Table
CREATE TABLE IF NOT EXISTS `research` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_class` VARCHAR(50) NOT NULL DEFAULT 'fas fa-star',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Education Journey Table
CREATE TABLE IF NOT EXISTS `education` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `degree_title` VARCHAR(200) NOT NULL,
  `specialization` VARCHAR(200) NOT NULL,
  `institution` VARCHAR(200) NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `status_text` VARCHAR(100) NOT NULL,
  `status_type` ENUM('current', 'completed') NOT NULL DEFAULT 'completed',
  `icon_class` VARCHAR(50) NOT NULL DEFAULT 'fas fa-graduation-cap',
  `description` TEXT NOT NULL,
  `key_areas_label` VARCHAR(100) NOT NULL DEFAULT 'Key Areas of Study',
  `key_areas_tags` VARCHAR(255) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Experience & Internships Table
CREATE TABLE IF NOT EXISTS `experience` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_title` VARCHAR(200) NOT NULL,
  `organization` VARCHAR(200) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `mini_project` VARCHAR(255) NULL,
  `main_project` VARCHAR(255) NULL,
  `skills_acquired` VARCHAR(255) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Certificates & Achievements Table (Sheet 1)
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sno` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) NOT NULL,
  `competition_level` VARCHAR(100) NULL,
  `workshop_level` VARCHAR(100) NULL,
  `other_category` VARCHAR(100) NULL,
  `event_date` DATE NULL,
  `date_text` VARCHAR(100) NOT NULL,
  `place_rank` VARCHAR(10) NULL,
  `cash_award` DECIMAL(10,2) NULL,
  `remarks` TEXT NULL,
  `image_path` VARCHAR(255) NOT NULL DEFAULT '/uploads/certificates/cert-placeholder.jpg',
  `thumbnail_path` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Camp Certificates Table (Sheet 2)
CREATE TABLE IF NOT EXISTS `camp_certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sno` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) NOT NULL,
  `camp_level` VARCHAR(100) NULL,
  `date_from` DATE NULL,
  `date_to` DATE NULL,
  `date_range_text` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `cash_award` DECIMAL(10,2) NULL,
  `certificate_no` VARCHAR(100) NULL,
  `other_note` TEXT NULL,
  `image_path` VARCHAR(255) NOT NULL DEFAULT '/uploads/certificates/camp-placeholder.jpg',
  `thumbnail_path` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Achievements Table
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_class` VARCHAR(50) NOT NULL DEFAULT 'fas fa-trophy',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Contact Messages Inbox Table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
