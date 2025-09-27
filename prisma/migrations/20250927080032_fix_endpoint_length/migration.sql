-- DropIndex
DROP INDEX `PushSubscription_endpoint_key` ON `pushsubscription`;

-- AlterTable
ALTER TABLE `pushsubscription` MODIFY `endpoint` TEXT NOT NULL;
