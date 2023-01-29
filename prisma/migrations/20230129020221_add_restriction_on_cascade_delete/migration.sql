-- DropForeignKey
ALTER TABLE `Answers` DROP FOREIGN KEY `Answers_examsId_fkey`;

-- DropForeignKey
ALTER TABLE `Answers` DROP FOREIGN KEY `Answers_membersId_fkey`;

-- DropForeignKey
ALTER TABLE `Exams` DROP FOREIGN KEY `Exams_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `Groups` DROP FOREIGN KEY `Groups_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupsHasMembers` DROP FOREIGN KEY `GroupsHasMembers_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupsHasMembers` DROP FOREIGN KEY `GroupsHasMembers_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `MembersHasExams` DROP FOREIGN KEY `MembersHasExams_examsId_fkey`;

-- DropForeignKey
ALTER TABLE `MembersHasExams` DROP FOREIGN KEY `MembersHasExams_memberId_fkey`;

-- AddForeignKey
ALTER TABLE `Groups` ADD CONSTRAINT `Groups_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exams` ADD CONSTRAINT `Exams_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answers` ADD CONSTRAINT `Answers_membersId_fkey` FOREIGN KEY (`membersId`) REFERENCES `Members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answers` ADD CONSTRAINT `Answers_examsId_fkey` FOREIGN KEY (`examsId`) REFERENCES `Exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupsHasMembers` ADD CONSTRAINT `GroupsHasMembers_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupsHasMembers` ADD CONSTRAINT `GroupsHasMembers_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembersHasExams` ADD CONSTRAINT `MembersHasExams_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembersHasExams` ADD CONSTRAINT `MembersHasExams_examsId_fkey` FOREIGN KEY (`examsId`) REFERENCES `Exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
