<?php
error_reporting(E_ALL);
ini_set('display_errors','On');
ini_set('trader.real_precision','8');
set_time_limit(0);
require '/aute/global/ccxt/ccxt.php';
require '/aute/global/eksternal/functions.php.php';
require '/aute/global/eksternal/konf6jon_trading_binance_v202.php';
require '/aute/global/eksternal/database.class.php';
require '/aute/global/eksternal/indicators.php';
require '/aute/global/eksternal/futures_common.php';

$ip = ipinfo();
$dba = null;

function calcularStrengthConfidence($data)
{
    $strength = 0;
    $confidence = 0;

    $regime = $data['regime'] ?? 'NEUTRAL';

    $isLong = in_array($regime, ['LONG_STRONG', 'LONG_WEAK'], true);
    $isShort = in_array($regime, ['SHORT_STRONG', 'SHORT_WEAK'], true);

    // =====================================================
    // STRENGTH
    // Mede a força interna do timeframe atual (15m)
    // =====================================================

    if ($isLong) {
        if (!empty($data['ema_bull'])) {
            $strength += 15;
        }

        if (!empty($data['ema9_rising'])) {
            $strength += 10;
        }

        if (!empty($data['ema26_rising'])) {
            $strength += 10;
        }

        if (!empty($data['macd_rising'])) {
            $strength += 10;
        }

        if (!empty($data['hist_rising'])) {
            $strength += 10;
        }

        if (!empty($data['macd_bull_zone'])) {
            $strength += 10;
        }

        if (!empty($data['bull_momentum'])) {
            $strength += 15;
        }

        if (!empty($data['bull_structure'])) {
            $strength += 20;
        }
    }

    if ($isShort) {
        if (!empty($data['ema_bear'])) {
            $strength += 15;
        }

        if (!empty($data['ema9_falling'])) {
            $strength += 10;
        }

        if (!empty($data['ema26_falling'])) {
            $strength += 10;
        }

        if (!empty($data['macd_falling'])) {
            $strength += 10;
        }

        if (!empty($data['hist_falling'])) {
            $strength += 10;
        }

        if (!empty($data['macd_bear_zone'])) {
            $strength += 10;
        }

        if (!empty($data['bear_momentum'])) {
            $strength += 15;
        }

        if (!empty($data['bear_structure'])) {
            $strength += 20;
        }
    }

    $strength = min(100, $strength);

    // =====================================================
    // CONFIDENCE
    // Mede concordância entre 15m, 1h e 1d
    // =====================================================

    $regime15m = $data['regime_15m'] ?? 'NEUTRAL';
    $regime1h  = $data['regime_1h'] ?? 'NEUTRAL';
    $regime1d  = $data['regime_1d'] ?? 'NEUTRAL';

    if ($isLong) {
        if ($regime15m === 'LONG_STRONG') {
            $confidence += 40;
        } elseif ($regime15m === 'LONG_WEAK') {
            $confidence += 30;
        }

        if ($regime1h === 'LONG_STRONG') {
            $confidence += 35;
        } elseif ($regime1h === 'LONG_WEAK') {
            $confidence += 25;
        }

        if ($regime1d === 'LONG_STRONG') {
            $confidence += 25;
        } elseif ($regime1d === 'LONG_WEAK') {
            $confidence += 15;
        }
    }

    if ($isShort) {
        if ($regime15m === 'SHORT_STRONG') {
            $confidence += 40;
        } elseif ($regime15m === 'SHORT_WEAK') {
            $confidence += 30;
        }

        if ($regime1h === 'SHORT_STRONG') {
            $confidence += 35;
        } elseif ($regime1h === 'SHORT_WEAK') {
            $confidence += 25;
        }

        if ($regime1d === 'SHORT_STRONG') {
            $confidence += 25;
        } elseif ($regime1d === 'SHORT_WEAK') {
            $confidence += 15;
        }
    }

    $confidence = min(100, $confidence);

    // =====================================================
    // LABELS
    // =====================================================

    if ($strength >= 85) {
        $strengthLabel = 'VERY_STRONG';
    } elseif ($strength >= 70) {
        $strengthLabel = 'STRONG';
    } elseif ($strength >= 50) {
        $strengthLabel = 'MODERATE';
    } elseif ($strength >= 30) {
        $strengthLabel = 'WEAK';
    } else {
        $strengthLabel = 'VERY_WEAK';
    }

    if ($confidence >= 85) {
        $confidenceLabel = 'VERY_HIGH';
    } elseif ($confidence >= 70) {
        $confidenceLabel = 'HIGH';
    } elseif ($confidence >= 50) {
        $confidenceLabel = 'MEDIUM';
    } elseif ($confidence >= 30) {
        $confidenceLabel = 'LOW';
    } else {
        $confidenceLabel = 'VERY_LOW';
    }

    return [
        'strength' => $strength,
        'strength_label' => $strengthLabel,
        'confidence' => $confidence,
        'confidence_label' => $confidenceLabel
    ];
}

while (true) {

    try {
        if ($dba === null) {
            $dba = new Database('automato');
        }

        $events = $db->select_to_array("outbox_events", "*", "WHERE status = 0 ORDER BY id ASC LIMIT 50", null);
        if (!$events) {
            usleep(500000); // 0.5s
            continue;
        }

        foreach ($events as $event) {

            $payload = $event['payload'];
            $tipo = strtolower($event['tipo']);

            switch ($tipo) {
                case 'regime_btc':

                    $data = json_decode($payload, true);
                    if (!$data) {
                        $db->update(
                            "outbox_events",
                            "WHERE id=:id",
                            [
                                ':id' => $event['id'],
                                ':status' => 3
                            ]
                        );
                        break;
                    }

                    $data_func = calcularStrengthConfidence($data);

                    $bind = [
                        ':symbol' => 'BTC',
                        ':quote_asset' => 'USDT',
                        ':timeframe' => '15m',
                        ':regime' => $data['regime_15m'],
                        ':strength' => $data_func['strength'],
                        ':ai_confidence' => $data_func['confidence'],
                        ':analyzed_at' => $event['data_cadastro']
                    ];
                    $dba->insert("market_regimes", $bind);

                    $bind = [
                        ':symbol' => 'BTC',
                        ':quote_asset' => 'USDT',
                        ':timeframe' => '1h',
                        ':regime' => $data['regime_1h'],
                        ':strength' => $data_func['strength'],
                        ':ai_confidence' => $data_func['confidence'],
                        ':analyzed_at' => $event['data_cadastro']
                    ];
                    $dba->insert("market_regimes", $bind);

                    $bind = [
                        ':symbol' => 'BTC',
                        ':quote_asset' => 'USDT',
                        ':timeframe' => '1d',
                        ':regime' => $data['regime_1d'],
                        ':strength' => $data_func['strength'],
                        ':ai_confidence' => $data_func['confidence'],
                        ':analyzed_at' => $event['data_cadastro']
                    ];
                    $dba->insert("market_regimes", $bind);

                    $bind = [
                        ':id' => $event['id'],
                        ':status' => 1
                    ];
                    $db->update("outbox_events", "WHERE id=:id", $bind);

                break;
                
                case 'signals':

                    $data = json_decode($payload, true);
                    if (!$data) {
                        $db->update(
                            "outbox_events",
                            "WHERE id=:id",
                            [
                                ':id' => $event['id'],
                                ':status' => 3
                            ]
                        );
                        break;
                    }
                    $dba->insert("signals", $data);

                    $bind = [
                        ':id' => $event['id'],
                        ':status' => 1
                    ];
                    $db->update("outbox_events", "WHERE id=:id", $bind);

                break;
                
                case 'signals_update':

                    $data = json_decode($payload, true);
                    if (!$data) {
                        $db->update(
                            "outbox_events",
                            "WHERE id=:id",
                            [
                                ':id' => $event['id'],
                                ':status' => 3
                            ]
                        );
                        break;
                    }
                    $bind = [
                        ':id' => $data[':data'],
                        ':result_perc' => $data[':result_perc']
                    ];
                    $dba->update("signals", "WHERE id=:id", $bind);

                    $bind = [
                        ':id' => $event['id'],
                        ':status' => 1
                    ];
                    $db->update("outbox_events", "WHERE id=:id", $bind);

                break;

                default:
                    $bind = [
                        ':id' => $event['id'],
                        ':status' => 3
                    ];
                    $db->update("outbox_events", "WHERE id=:id", $bind);
                break;
            }
        }



        $menosdays = date('Y-m-d H:i:s',strtotime('-7 days',strtotime( date("Y-m-d H:i:s") )));
        $outbox_events = $db->delete("outbox_events", "WHERE data_cadastro <= '".$menosdays."' ", null);

    } catch (Throwable $e) {
        echo date('Y-m-d H:i:s') . " - ERRO: " . $e->getMessage() . PHP_EOL;
        exit(1);
    }
}