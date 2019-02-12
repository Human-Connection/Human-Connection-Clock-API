CREATE TABLE IF NOT EXISTS `apikeys` (
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid` int(1) DEFAULT NULL,
  UNIQUE KEY `secret` (`secret`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `entries` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(320) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `anon` int(1) DEFAULT '0',
  `ipv4` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confirm_key` varchar(75) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beta` int(1) DEFAULT '0',
  `newsletter` int(1) DEFAULT '0',
  `pax` int(1) DEFAULT '0',
  `email_confirmed` int(1) DEFAULT '0',
  `status` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;