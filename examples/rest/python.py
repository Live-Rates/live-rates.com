"""Live-Rates REST API — Python example.

Requires: pip install requests
Docs:     https://github.com/Live-Rates/live-rates.com#rest-api
"""
import os
import requests

KEY = os.environ.get("LIVERATES_KEY")
BASE = "https://www.live-rates.com"


def get(path: str) -> list | dict:
    r = requests.get(f"{BASE}{path}", timeout=10)
    r.raise_for_status()
    return r.json()


if __name__ == "__main__":
    # Full quotes for every instrument. Keyless = 3/hour/IP; with key = unlimited.
    all_rates = get(f"/rates?key={KEY}" if KEY else "/rates")
    if all_rates and "error" in all_rates[0]:
        raise SystemExit(all_rates[0]["error"])
    print(f"Loaded {len(all_rates)} instruments")
    for row in all_rates[:3]:
        print(f"{row['currency']:10s} bid={row['bid']:<10s} ask={row['ask']}")

    # Specific pairs (key required).
    if not KEY:
        print("\nSet LIVERATES_KEY to also fetch /api/price for specific pairs.")
    else:
        quote = get(f"/api/price?key={KEY}&rate=EUR_USD,GBP_USD,BTC_USD")
        for row in quote:
            print(f"{row['currency']:10s} bid={row['bid']:<10s} ask={row['ask']}")
