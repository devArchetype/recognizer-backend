/*
  Warnings:

  - You are about to drop the `_ExamsToMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupsToMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ExamsToMembers` DROP FOREIGN KEY `_ExamsToMembers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ExamsToMembers` DROP FOREIGN KEY `_ExamsToMembers_B_fkey`;

-- DropForeignKey
ALTER TABLE `_GroupsToMembers` DROP FOREIGN KEY `_GroupsToMembers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_GroupsToMembers` DROP FOREIGN KEY `_GroupsToMembers_B_fkey`;

-- DropTable
DROP TABLE `_ExamsToMembers`;

-- DropTable
DROP TABLE `_GroupsToMembers`;

-- CreateTable
CREATE TABLE `GroupsHasMembers` (
    `id` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MembersHasExams` (
    `id` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `examsId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupsHasMembers` ADD CONSTRAINT `GroupsHasMembers_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupsHasMembers` ADD CONSTRAINT `GroupsHasMembers_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembersHasExams` ADD CONSTRAINT `MembersHasExams_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembersHasExams` ADD CONSTRAINT `MembersHasExams_examsId_fkey` FOREIGN KEY (`examsId`) REFERENCES `Exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
