-- DropIndex
DROP INDEX `uq_market_regime` ON `market_regimes`;

-- CreateIndex
CREATE INDEX `idx_market_regime_history` ON `market_regimes`(`symbol`, `quote_asset`, `timeframe`, `analyzed_at`);
