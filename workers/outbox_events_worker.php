<?php
error_reporting(E_ALL);
ini_set('display_errors','On');
ini_set('trader.real_precision','8');
set_time_limit(0);

$globalPath = getenv('GLOBAL_PATH');
if (!$globalPath) {
    throw new RuntimeException('GLOBAL_PATH não configurado');
}
require $globalPath . '/konf6jon_automato.php';
require $globalPath . '/database.class.php';
require $globalPath . '/futures_common.php';

$dba = null;

while (true) {
    try {
        if ($dba === null) {
            $dba = new Database('automato');
        }

        $events = $db->select_to_array("outbox_events", "*", "WHERE status = 0 ORDER BY id ASC LIMIT 100", null);
        if (!$events) {
            usleep(500000); // 0.5s
            continue;
        }

        foreach ($events as $event) {

            $payload = $event['payload'];
            $type = strtolower($event['tipo']);

            switch ($type) {
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

                    $symbol = $data[':symbol'] ?? $data['symbol'] ?? null;
                    $quoteAsset = $data[':quote_asset'] ?? $data['quote_asset'] ?? null;
                    $detectedAt = $data[':detected_at'] ?? $data['detected_at'] ?? null;
                    $lastSignal = $dba->select_single_to_array(
                        "signals",
                        "id, detected_at, status",
                        "WHERE symbol=:symbol
                         AND quote_asset=:quote_asset
                         AND status='active'
                         ORDER BY detected_at DESC
                         LIMIT 1",
                        [
                            ':symbol' => $symbol,
                            ':quote_asset' => $quoteAsset
                        ]
                    );

                    if (!$lastSignal) {
                        $dba->insert("signals", $data);
                    }

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
                    $dba->update("signals", "WHERE data=:data", $data);

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

        $dba->update( "signals", "WHERE status='active'  AND detected_at <= DATE_SUB(NOW(), INTERVAL 24 HOUR)", [ ':status' => 'closed', ':closed_at' => date('Y-m-d H:i:s')]);
        
        $deleteBefore = date('Y-m-d H:i:s',strtotime('-7 days',strtotime( date("Y-m-d H:i:s") )));
        $delete_dba_outbox = $dba->delete("signals", "WHERE detected_at <= '".$deleteBefore."' ", null);
        $delete_db_outbox = $db->delete("outbox_events", "WHERE data_cadastro <= '".$deleteBefore."' ", null);
        usleep(500000);

    } catch (Throwable $e) {
        echo date('Y-m-d H:i:s') . " - ERRO: " . $e->getMessage() . PHP_EOL;
        exit(1);
    }
}