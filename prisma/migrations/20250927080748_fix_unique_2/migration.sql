/*
  Warnings:

  - A unique constraint covering the columns `[endpoint]` on the table `PushSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pushsubscription` MODIFY `endpoint` VARCHAR(1024) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PushSubscription_endpoint_key` ON `PushSubscription`(`endpoint`);
