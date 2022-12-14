**api/triggers/trigger-buy-orders**
- Runs every 5 minutes,
- takes all “READY” trades and sends to Alpaca, then changes state to “ACTIVE”

**api/triggers/trigger-update-orders**
- Runs every 5 minutes,
- takes all "ACTIVE" trades and checks which have received any completed purchases in Alpaca. In that case, changes the status to “PARTIALLY_FILLED” or “FILLED”.
- takes all “PARTIALLY_FILLED” trades and checks which have received any fully completed purchases in Alpaca. In that case, changes the status to "FILLED".

**api/triggers/trigger-clear-old-orders**
- Runs at 04:00,
- takes all "READY" trades that are not today's date and discards them.
