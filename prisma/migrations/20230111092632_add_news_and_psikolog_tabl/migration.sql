/*
  Warnings:

  - Added the required column `address` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `phone` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_image` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `psikolog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `skill` VARCHAR(255) NOT NULL,
    `psikolog_image` VARCHAR(255) NULL,
    `virtual_account_payment` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `psikolog_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time` VARCHAR(255) NOT NULL,
    `is_selected` BOOLEAN NOT NULL,
    `psikolog_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `psikolog_schedules` ADD CONSTRAINT `psikolog_schedules_psikolog_id_fkey` FOREIGN KEY (`psikolog_id`) REFERENCES `psikolog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
