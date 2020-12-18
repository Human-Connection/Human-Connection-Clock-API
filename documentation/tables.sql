CREATE TABLE IF NOT EXISTS `apikeys` (
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid` int(1) DEFAULT NULL,
  UNIQUE KEY `secret` (`secret`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `entries` (
   `id` bigint(20) UNSIGNED NOT NULL,
   `email` varchar(255) NOT NULL,
   `firstname` varchar(255) NOT NULL,
   `lastname` varchar(255) DEFAULT NULL,
   `message` text NOT NULL,
   `country` varchar(4) DEFAULT NULL,
   `image` varchar(255) NOT NULL,
   `email_confirmed` smallint(1) UNSIGNED NOT NULL DEFAULT '0',
   `confirm_key` varchar(255) DEFAULT NULL,
   `status` smallint(1) UNSIGNED NOT NULL DEFAULT '0',
   `anon` smallint(1) UNSIGNED NOT NULL DEFAULT '0',
   `created_at` bigint(20) UNSIGNED DEFAULT NULL,
   `updated_at` bigint(20) UNSIGNED DEFAULT NULL,
   `confirmed_at` bigint(20) UNSIGNED DEFAULT NULL,
   `beta` smallint(1) NOT NULL DEFAULT '0',
   `newsletter` smallint(1) NOT NULL DEFAULT '0',
   `pax` smallint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
