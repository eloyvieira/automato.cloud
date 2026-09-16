#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

webhook () {
    app="outbox_events_worker.php"
    app_pid=`ps aux  | grep $app | grep -v grep | awk '{ print $2 }'`
    echo $app_pid

    if ps -p $app_pid > /dev/null 2>&1; then
        echo "outbox_events_worker is already running."
        echo "Skipping startup to avoid duplicate instances."
        exit
    else
        echo "outbox_events_worker is not running."
        echo "Starting worker..."
        /usr/bin/php "$SCRIPT_DIR/outbox_events_worker.php" >/dev/null 2>&1
        exit
    fi
}

execution () {
    webhook
}

execution

