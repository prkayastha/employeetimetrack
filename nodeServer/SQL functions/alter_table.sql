ALTER TABLE `user_management`.`Projects` 
ADD COLUMN `trelloBoardId` VARCHAR(255) NULL AFTER `projectOwnerUserId`;

ALTER TABLE `user_management`.`Tasks` 
ADD COLUMN `trelloCardId` VARCHAR(255) NULL AFTER `projectId`;