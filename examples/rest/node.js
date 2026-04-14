// Live-Rates REST API — Node.js (18+) example.
// Run:  node node.js
// Docs: https://github.com/Live-Rates/live-rates.com#rest-api

const KEY = process.env.LIVERATES_KEY;
const BASE = "https://www.live-rates.com";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Full quotes for every instrument. Keyless = 3 req/hour/IP; with key = unlimited.
const all = await get(`/rates${KEY ? `?key=${KEY}` : ""}`);
if (all[0]?.error) throw new Error(all[0].error);
console.log(`Loaded ${all.length} instruments. First 3:`, all.slice(0, 3));

// Specific pairs (key required).
if (!KEY) {
  console.log("\nSet LIVERATES_KEY to also fetch /api/price for specific pairs.");
} else {
  const quote = await get(`/api/price?key=${KEY}&rate=EUR_USD,GBP_USD,BTC_USD`);
  console.table(quote);
}
