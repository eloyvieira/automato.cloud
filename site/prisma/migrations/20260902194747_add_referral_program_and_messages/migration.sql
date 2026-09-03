-- AlterTable
ALTER TABLE `users` ADD COLUMN `referral_code` VARCHAR(6) NULL,
    ADD COLUMN `referred_by_id` BIGINT NULL;

-- CreateTable
CREATE TABLE `referral_commissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `referrer_id` BIGINT NOT NULL,
    `referred_user_id` BIGINT NOT NULL,
    `payment_id` BIGINT NOT NULL,
    `amount` DECIMAL(18, 8) NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'USDT',
    `rate` DECIMAL(5, 4) NOT NULL DEFAULT 0.1000,
    `status` ENUM('pending', 'available', 'paid', 'canceled') NOT NULL DEFAULT 'available',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `referral_commissions_payment_id_key`(`payment_id`),
    INDEX `idx_referrer_status`(`referrer_id`, `status`),
    INDEX `idx_referred_user`(`referred_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('unread', 'read', 'archived') NOT NULL DEFAULT 'unread',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_status_created`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_referral_code_key` ON `users`(`referral_code`);

-- CreateIndex
CREATE INDEX `idx_referred_by` ON `users`(`referred_by_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_referred_by_id_fkey` FOREIGN KEY (`referred_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_commissions` ADD CONSTRAINT `referral_commissions_referrer_id_fkey` FOREIGN KEY (`referrer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_commissions` ADD CONSTRAINT `referral_commissions_referred_user_id_fkey` FOREIGN KEY (`referred_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_commissions` ADD CONSTRAINT `referral_commissions_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

