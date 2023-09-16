-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2023 at 05:46 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moodsdb`
--
CREATE DATABASE IF NOT EXISTS `moodsdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `moodsdb`;

-- --------------------------------------------------------

--
-- Table structure for table `mood`
--

CREATE TABLE `mood` (
  `mood_id` int(11) NOT NULL,
  `mood` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `moodlog`
--

CREATE TABLE `moodlog` (
  `moodlog_id` int(11) NOT NULL,
  `user_mood_id` int(11) NOT NULL,
  `context` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_mood`
--

CREATE TABLE `user_mood` (
  `user_mood_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mood`
--
ALTER TABLE `mood`
  ADD PRIMARY KEY (`mood_id`),
  ADD UNIQUE KEY `mood` (`mood`);

--
-- Indexes for table `moodlog`
--
ALTER TABLE `moodlog`
  ADD PRIMARY KEY (`moodlog_id`),
  ADD KEY `fk_moodlog_user_mood_id` (`user_mood_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),

--
-- Indexes for table `user_mood`
--
ALTER TABLE `user_mood`
  ADD PRIMARY KEY (`user_mood_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`mood_id`),
  ADD KEY `FK_mood_user_mood_id` (`mood_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mood`
--
ALTER TABLE `mood`
  MODIFY `mood_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `moodlog`
--
ALTER TABLE `moodlog`
  MODIFY `moodlog_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_mood`
--
ALTER TABLE `user_mood`
  MODIFY `user_mood_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `moodlog`
--
ALTER TABLE `moodlog`
  ADD CONSTRAINT `fk_moodlog_user_mood_id` FOREIGN KEY (`user_mood_id`) REFERENCES `user_mood` (`user_mood_id`);

--
-- Constraints for table `user_mood`
--
ALTER TABLE `user_mood`
  ADD CONSTRAINT `FK_mood_user_mood_id` FOREIGN KEY (`mood_id`) REFERENCES `mood` (`mood_id`),
  ADD CONSTRAINT `FK_mood_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
