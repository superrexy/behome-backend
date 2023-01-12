/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `psikolog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `psikolog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `news` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `psikolog` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `psikolog_user_id_key` ON `psikolog`(`user_id`);

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `psikolog` ADD CONSTRAINT `psikolog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
