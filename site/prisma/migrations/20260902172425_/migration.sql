-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `email` VARCHAR(190) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `type` ENUM('premium', 'api') NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `billing_period` ENUM('weekly', 'monthly') NOT NULL DEFAULT 'weekly',
    `api_requests_day` INTEGER UNSIGNED NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `plans_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `plan_id` INTEGER NOT NULL,
    `provider` VARCHAR(30) NOT NULL,
    `provider_customer_id` VARCHAR(100) NULL,
    `provider_subscription_id` VARCHAR(100) NULL,
    `status` ENUM('active', 'past_due', 'canceled', 'expired') NOT NULL,
    `starts_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NULL,
    `next_payment_at` DATETIME(3) NULL,
    `canceled_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `subscriptions_provider_subscription_id_key`(`provider_subscription_id`),
    INDEX `idx_user_status`(`user_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `subscription_id` BIGINT NULL,
    `provider_payment_id` VARCHAR(120) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'USD',
    `status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL,
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payments_provider_payment_id_key`(`provider_payment_id`),
    INDEX `idx_user_created`(`user_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `market_regimes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(20) NOT NULL,
    `quote_asset` ENUM('USDT', 'USDC', 'BTC') NOT NULL,
    `timeframe` ENUM('15m', '1h', '4h', '1d') NOT NULL,
    `regime` ENUM('LONG_STRONG', 'LONG_WEAK', 'NEUTRAL', 'SHORT_WEAK', 'SHORT_STRONG') NOT NULL,
    `strength` DECIMAL(5, 2) NULL,
    `ai_confidence` DECIMAL(5, 2) NULL,
    `data` JSON NULL,
    `analyzed_at` DATETIME(3) NOT NULL,

    INDEX `idx_regime`(`regime`, `timeframe`),
    UNIQUE INDEX `uq_market_regime`(`symbol`, `quote_asset`, `timeframe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `signals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `symbol` VARCHAR(20) NOT NULL,
    `quote_asset` ENUM('USDT', 'USDC', 'BTC') NOT NULL,
    `strategy` ENUM('scalping', 'day', 'swing') NOT NULL,
    `timeframe` ENUM('15m', '1h', '4h', '1d') NOT NULL,
    `direction` ENUM('LONG', 'SHORT') NOT NULL,
    `regime` ENUM('LONG_STRONG', 'LONG_WEAK', 'SHORT_WEAK', 'SHORT_STRONG') NOT NULL,
    `reliability` DECIMAL(5, 2) NULL,
    `entry_price` DECIMAL(24, 12) NULL,
    `stop_loss` DECIMAL(24, 12) NULL,
    `take_profit1` DECIMAL(24, 12) NULL,
    `take_profit2` DECIMAL(24, 12) NULL,
    `result_perc` DECIMAL(8, 4) NULL,
    `status` ENUM('active', 'expired', 'closed') NOT NULL DEFAULT 'active',
    `detected_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NULL,
    `closed_at` DATETIME(3) NULL,
    `data` JSON NULL,

    INDEX `idx_active`(`status`, `strategy`, `timeframe`, `detected_at`),
    INDEX `idx_symbol`(`symbol`, `quote_asset`, `detected_at`),
    INDEX `idx_rank`(`status`, `reliability`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
