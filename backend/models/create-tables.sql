CREATE TABLE `thought`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `heading` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `datetime_created` DATETIME NOT NULL
);

CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` TEXT NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `superuser` BOOLEAN NOT NULL
);

CREATE TABLE `picture` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` TEXT NOT NULL,
	`locationName` TEXT,
	`imgSrc` TEXT NOT NULL
);
