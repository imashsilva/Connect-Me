-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema connect_me
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema connect_me
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `connect_me` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `connect_me` ;

-- -----------------------------------------------------
-- Table `connect_me`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone_number` VARCHAR(20) NULL DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) NULL DEFAULT NULL,
  `profile_picture` VARCHAR(255) NULL DEFAULT NULL,
  `status` VARCHAR(100) NULL DEFAULT 'Hey there! I am using ChatApp',
  `last_seen` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `is_online` TINYINT(1) NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_number` (`phone_number` ASC) VISIBLE,
  INDEX `idx_users_username` (`username` ASC) VISIBLE,
  INDEX `idx_users_email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `connect_me`.`chats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`chats` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `chat_type` ENUM('INDIVIDUAL', 'GROUP') NOT NULL,
  `chat_name` VARCHAR(100) NULL DEFAULT NULL,
  `created_by` BIGINT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `last_message_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `created_by` (`created_by` ASC) VISIBLE,
  CONSTRAINT `chats_ibfk_1`
    FOREIGN KEY (`created_by`)
    REFERENCES `connect_me`.`users` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `connect_me`.`chat_participants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`chat_participants` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `chat_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `joined_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `role` ENUM('ADMIN', 'MEMBER') NULL DEFAULT 'MEMBER',
  `is_muted` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_participant` (`chat_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_chat_participants_user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `chat_participants_ibfk_1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `connect_me`.`chats` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `chat_participants_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `connect_me`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `connect_me`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`contacts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `contact_user_id` BIGINT NOT NULL,
  `contact_name` VARCHAR(100) NULL DEFAULT NULL,
  `is_blocked` TINYINT(1) NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_contact` (`user_id` ASC, `contact_user_id` ASC) VISIBLE,
  INDEX `contact_user_id` (`contact_user_id` ASC) VISIBLE,
  CONSTRAINT `contacts_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `connect_me`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `contacts_ibfk_2`
    FOREIGN KEY (`contact_user_id`)
    REFERENCES `connect_me`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `connect_me`.`group_chat_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`group_chat_details` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `chat_id` BIGINT NOT NULL,
  `group_description` TEXT NULL DEFAULT NULL,
  `group_picture` VARCHAR(255) NULL DEFAULT NULL,
  `max_participants` INT NULL DEFAULT '256',
  PRIMARY KEY (`id`),
  INDEX `chat_id` (`chat_id` ASC) VISIBLE,
  CONSTRAINT `group_chat_details_ibfk_1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `connect_me`.`chats` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `connect_me`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `chat_id` BIGINT NOT NULL,
  `sender_id` BIGINT NOT NULL,
  `message_type` ENUM('TEXT', 'IMAGE', 'VIDEO', 'FILE', 'AUDIO') NULL DEFAULT 'TEXT',
  `content` TEXT NULL DEFAULT NULL,
  `media_url` VARCHAR(255) NULL DEFAULT NULL,
  `file_size` BIGINT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_edited` TINYINT(1) NULL DEFAULT '0',
  `reply_to_message_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `sender_id` (`sender_id` ASC) VISIBLE,
  INDEX `reply_to_message_id` (`reply_to_message_id` ASC) VISIBLE,
  INDEX `idx_messages_chat_id` (`chat_id` ASC) VISIBLE,
  INDEX `idx_messages_created_at` (`created_at` ASC) VISIBLE,
  CONSTRAINT `messages_ibfk_1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `connect_me`.`chats` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2`
    FOREIGN KEY (`sender_id`)
    REFERENCES `connect_me`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_3`
    FOREIGN KEY (`reply_to_message_id`)
    REFERENCES `connect_me`.`messages` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `connect_me`.`message_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect_me`.`message_status` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `message_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `status` ENUM('SENT', 'DELIVERED', 'READ') NULL DEFAULT 'SENT',
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_message_status` (`message_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_message_status_user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `message_status_ibfk_1`
    FOREIGN KEY (`message_id`)
    REFERENCES `connect_me`.`messages` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `message_status_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `connect_me`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
