# ACTIVE

**sharkster/trigger-daily-run**
- runs every morning

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

#  DISABLED
**~~api/triggers/trigger-check-status-positions~~**
- Runs every 5 minutes,
- Takes all "FILLED" trades, and on each trade, checks if it is stop-loss or take-profit. Then, performs stop-loss and/or take-profit actions accordingly. 
- If stop-loss, field "sold" is created with timestamp. 
- If take-profit, a new trade with _**side = trade**_ is added to the database. The inital trade entity is kept but the fields quantity and status are updated. Status is updated to keep track on what breakouts we already have taken profit on. 
