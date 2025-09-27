-- CreateTable
CREATE TABLE `Category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tour` (
    `tour_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `available_slots` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`tour_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourImage` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_url` VARCHAR(191) NOT NULL,
    `tour_id` INTEGER NOT NULL,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Itinerary` (
    `itinerary_id` INTEGER NOT NULL AUTO_INCREMENT,
    `day_number` INTEGER NOT NULL,
    `day_title` VARCHAR(191) NULL,
    `day_description` VARCHAR(191) NULL,
    `tour_id` INTEGER NOT NULL,

    PRIMARY KEY (`itinerary_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tour` ADD CONSTRAINT `Tour_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourImage` ADD CONSTRAINT `TourImage_tour_id_fkey` FOREIGN KEY (`tour_id`) REFERENCES `Tour`(`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Itinerary` ADD CONSTRAINT `Itinerary_tour_id_fkey` FOREIGN KEY (`tour_id`) REFERENCES `Tour`(`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE;
