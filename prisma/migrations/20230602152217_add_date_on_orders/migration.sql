/*
  Warnings:

  - You are about to drop the column `is_read` on the `chat_rooms` table. All the data in the column will be lost.
  - Added the required column `consultation_day` to the `chat_rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat_rooms` DROP COLUMN `is_read`,
    ADD COLUMN `consultation_day` DATETIME(3) NOT NULL,
    ADD COLUMN `is_finished` BOOLEAN NOT NULL DEFAULT false;
