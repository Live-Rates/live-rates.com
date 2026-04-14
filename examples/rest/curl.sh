#!/usr/bin/env bash
# Live-Rates REST API — curl examples.
# Docs: https://github.com/Live-Rates/live-rates.com#rest-api

set -euo pipefail

KEY="${LIVERATES_KEY:-YOUR_KEY}"
BASE="https://www.live-rates.com"

echo "# Every instrument, full quotes (keyless = 3/hour/IP; pass ?key= for unlimited)"
curl -s "$BASE/rates?key=$KEY" | head -c 500; echo; echo

echo "# Fetch a single pair"
curl -s "$BASE/api/price?key=$KEY&rate=EURUSD"; echo; echo

echo "# Fetch several pairs at once"
curl -s "$BASE/api/price?key=$KEY&rate=EUR_USD,GBP_USD,BTC_USD"; echo; echo

echo "# XML instead of JSON"
curl -s "$BASE/api/price?key=$KEY&rate=EURUSD&rate_format=xml"; echo; echo

echo "# Historical closing price"
curl -s "$BASE/historical?base=EUR&date=2024-03-15&symbols=USD,GBP&key=$KEY"; echo
