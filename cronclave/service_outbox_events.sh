#!/bin/bash

webhook () {
    app="service_outbox_events.php"
    app_pid=`ps aux  | grep $app | grep -v grep | awk '{ print $2 }'`
    echo $app_pid

    if ps -p $app_pid > /dev/null 2>&1; then
        echo "Script de aute service_outbox_events"
        echo "Não inicializando outra instância"
        exit
    else
        echo "Script de aute service_outbox_events não está rodando"
        /usr/bin/php /aute/robot/trading/binance/bot-trading-2.0.2__dev/service_outbox_events.php >/dev/null 2>&1
        exit
    fi
}

execution () {
    webhook
}

execution

