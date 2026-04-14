<div align="center">

# Live-Rates.com

**Real-time foreign exchange, commodity, and index rates — JSON, XML, and WebSocket streaming.**

[Website](https://www.live-rates.com) · [Get a key](https://www.live-rates.com/checkout) · [Contact](mailto:support@live-rates.com) · [Issues](https://github.com/Live-Rates/live-rates.com/issues)

[![API](https://img.shields.io/badge/API-v1-10b981?style=flat-square)](https://www.live-rates.com)
[![Updates](https://img.shields.io/badge/updates-~1s-blue?style=flat-square)](#streaming-api)
[![License](https://img.shields.io/badge/license-MIT-informational?style=flat-square)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](./CONTRIBUTING.md)

</div>

Live-Rates serves **170+ instruments** — major & minor FX pairs, metals, crypto, indices, and commodities — updated every second from liquidity providers. Use the **REST API** for polling, or the **Streaming API** (socket.io) for push updates with sub-second latency.

---

## Contents

- [Quickstart](#quickstart)
- [REST API](#rest-api)
  - [List all rates](#list-all-rates)
  - [Get specific pairs](#get-specific-pairs)
  - [Keyless / free tier](#keyless--free-tier)
  - [XML format](#xml-format)
  - [Response schema](#response-schema)
  - [Error responses](#error-responses)
- [Streaming API](#streaming-api)
  - [Endpoints](#streaming-endpoints)
  - [Connection lifecycle](#connection-lifecycle)
  - [Events](#events)
  - [Trial access](#trial-access)
- [Historical data](#historical-data)
- [Authentication & rate limits](#authentication--rate-limits)
- [Regions & geo-routing](#regions--geo-routing)
- [Client examples](#client-examples)
- [Cross-rates](#cross-rates)
- [Versioning](#versioning)
- [Support](#support)

---

## Quickstart

```bash
# Free, no key — up to 3 requests/hour/IP
curl "https://www.live-rates.com/rates"

# With a key — unlimited (subject to fair-use throttling)
curl "https://www.live-rates.com/api/price?key=YOUR_KEY&rate=EURUSD,GBPUSD"
```

Don't have a key? [Grab a trial](https://www.live-rates.com/#trial) — no card required.

---

## REST API

Base URL: `https://www.live-rates.com`

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /rates` | optional | Full quote stream for every instrument. Keyless = 3 req/hour/IP; with `?key=` = unlimited. |
| `GET /api/rates` | required | Lightweight index — one row per instrument with its last-update timestamp. |
| `GET /api/price?rate=PAIR[,PAIR...]` | required | Full quote(s) for one or more specific pairs. |
| `GET /historical/list` | required | List instruments that have historical coverage. |
| `GET /historical?base=&date=` | required | Closing price on a given UTC day. |
| `GET /historical/series?base=&start=&end=` | required | Series for a period (≤ 30 days). |

All endpoints accept `rate_format=xml` to switch the payload from JSON to XML.

### List all rates

Full quotes for every instrument. No key = 3 req/hour/IP; with a key = unlimited.

```http
GET /rates HTTP/1.1
Host: www.live-rates.com
```

<details>
<summary>Sample response</summary>

```json
[
  { "currency":"EUR/USD", "rate":"1.17942", "bid":"1.17942", "ask":"1.17953", "high":"1.18108", "low":"1.17559", "open":"1.17667", "close":"1.17942", "timestamp":"1776200275944" },
  { "currency":"GBP/USD", "rate":"1.35639", "bid":"1.35639", "ask":"1.35654", "high":"1.35891", "low":"1.3503",  "open":"1.35155", "close":"1.35639", "timestamp":"1776200277525" }
]
```
</details>

If you prefer a light index of what's available (pair + last-update timestamp only), call `GET /api/rates?key=YOUR_KEY`.

### Get specific pairs

Pair codes can be passed as `EURUSD` or `EUR_USD`. Multiple pairs as a CSV:

```http
GET /api/price?key=YOUR_KEY&rate=EUR_USD,EUR_GBP HTTP/1.1
Host: www.live-rates.com
```

<details>
<summary>Sample response</summary>

```json
[
  {
    "currency": "EUR/USD",
    "rate":     "1.08542",
    "bid":      "1.08542",
    "ask":      "1.08551",
    "high":     "1.08891",
    "low":      "1.08201",
    "open":     "1.08395",
    "close":    "n/a",
    "timestamp":"1713045600000"
  }
]
```
</details>

### Keyless / free tier

```bash
curl "https://www.live-rates.com/rates"
```

Capped at **3 requests per hour per IP**. Above that you'll see `503 Service Unavailable`. For continuous use, [grab a key](https://www.live-rates.com/checkout).

### XML format

Append `rate_format=xml` to any REST endpoint:

```bash
curl "https://www.live-rates.com/api/price?key=YOUR_KEY&rate=EURUSD&rate_format=xml"
```

### Response schema

| Field | Type | Notes |
|---|---|---|
| `currency` | string | Instrument identifier, e.g. `"EUR/USD"`, `"BTC/USD"`, `"BrentOil"`. |
| `rate` | string | Alias for `bid` (retained for backwards compatibility). |
| `bid` | string | Last bid price. |
| `ask` | string | Last ask price. |
| `high` | string | 24-hour high. |
| `low` | string | 24-hour low. |
| `open` | string | Opening price of the current daily session (or the previous close if markets are shut). |
| `close` | string | Closing price of the previous session, or `"n/a"` if the market has not closed yet today. |
| `timestamp` | string | Unix epoch in **milliseconds**. |

All numeric values are strings — parse them in your client.

### Error responses

| Status | Meaning |
|---|---|
| `200 OK` + JSON body with `{"error": "..."}` | Key expired, missing, or unknown. |
| `503 Service Unavailable` | Throttled — >1 req/s sustained over a 10-min average triggers a 10-min lockout. |
| `404 Not Found` | Unknown pair code in `rate=...`. |

---

## Streaming API

The streaming server is **socket.io v4** with Engine.IO v3/v4 compatibility enabled — any socket.io client from v2 onward will connect. Once authenticated, rate updates are pushed to your socket as they arrive from liquidity providers (typically every few hundred milliseconds).

### Streaming endpoints

| Region | Hostname |
|---|---|
| Global (geo-routed) | `wss.live-rates.com` |
| Europe | `eu-wss.live-rates.com` |
| Americas | `us-wss.live-rates.com` |
| Asia | `as-wss.live-rates.com` |

> The legacy `*-wss3.` hostnames still resolve for backwards compatibility but are no longer needed — every hostname above serves socket.io v2, v3, and v4 clients on the same endpoint.

### Connection lifecycle

1. Open a socket.io connection to one of the endpoints above.
2. *(optional)* Emit `instruments` with the pairs you want — omit to receive all.
3. Emit `key` with your subscription key (or the literal string `"trial"`).
4. Listen on `rates` for updates.

### Events

**Client → server**

| Event | Payload | Purpose |
|---|---|---|
| `instruments` | `"EURUSD,GBPUSD"` (CSV string) *or* `["EURUSD", "GBPUSD"]` (array) | Filter the feed to a subset of pairs. Emit **before** `key`. |
| `key` | `"YOUR_KEY"` *or* `{ "key": "YOUR_KEY" }` | Authenticate. Emitting `"trial"` starts a 2-minute trial feed. |

**Server → client**

The `rates` event carries **all** server messages. The payload is a JSON string; parse it to get one of three shapes:

```jsonc
// 1. Connection info (one-off, right after authentication)
{ "info": "Connected to Live-Rates Socket in EU Datacenter.. Feed Subscribed (v3)!" }

// 2. Authentication / session error (one-off, connection will be dropped)
{ "error": "You are not Authorised! (Wrong/Expired Key?)" }

// 3. A rate update (recurring, every few hundred ms per subscribed pair)
{
  "currency":  "EURUSD",     // no slash — different from REST, which uses "EUR/USD"
  "bid":       1.17949,       // number
  "ask":       1.17957,       // number
  "high":      1.18003,       // number — 24h high
  "low":       1.17876,       // number — 24h low
  "open":      "n/a",         // number OR the string "n/a" while session is live
  "close":     "n/a",         // number OR the string "n/a" while session is live
  "timestamp": 1776204525649  // number — unix epoch ms
}
```

> **REST vs streaming payload shape.** REST endpoints return all values as **strings** and pairs as `"EUR/USD"`; the streaming feed returns numeric values and pair codes like `"EURUSD"` (no slash). Plan your parser accordingly.

> **v3 vs v4 `info` string.** The production streaming fleet is migrating from a socket.io v2 server (info: `… (v3)!`) to a socket.io v4 server (info: `… (v4)!`). Any socket.io client from v2 onward works against either — the new server has `allowEIO3` enabled.

Other server messages you may see:

- `{ "info": "Subscribing for 2 Minutes (Trial)" }` — trial feed start
- `{ "info": "Trial with this IP recently used" }` — trial cooldown active
- `{ "error": "Another connection from this key.. Disconnected!" }` — only one active connection per key is allowed; opening a second drops the first.

### Trial access

Send `"trial"` as the key to get a **2-minute** live feed with no account. Trials are rate-limited per IP — wait an hour between attempts. Use trials to prototype; for anything else [grab a subscription](https://www.live-rates.com/checkout).

---

## Historical data

Coverage: ~170 instruments (FX majors/minors, metals, major crypto). All endpoints require a key.

**List available instruments**

```http
GET /historical/list?key=YOUR_KEY
```

**Closing price for a specific UTC day**

```http
GET /historical?base=EUR&date=2024-03-15&symbols=USD,GBP&key=YOUR_KEY
```

`symbols` is optional — omit to get every quote against `base`.

**Series over a date range** (max 30 days)

```http
GET /historical/series?base=EUR&start=2024-03-01&end=2024-03-15&symbols=USD&key=YOUR_KEY
```

---

## Authentication & rate limits

Authentication is a single query-string parameter:

```
?key=YOUR_KEY
```

| Tier | REST | Streaming |
|---|---|---|
| **Keyless** | 3 req/hour/IP on `/rates` | ❌ |
| **Trial** | — | 1× 2-min session per IP per hour |
| **Subscribed** | Unlimited, fair-use | 1 concurrent connection per key |

**Throttling.** If a single key averages more than 1 request per second over a rolling 10-minute window, it is locked out for 10 minutes and receives `503 Service Unavailable`. For high-volume use cases, prefer the Streaming API — a single socket replaces thousands of polls.

---

## Regions & geo-routing

Live-Rates runs three zones with local rate ingestion and full fail-over:

| Zone | Rails / REST | Streaming |
|---|---|---|
| Europe | `eu.live-rates.com` | `eu-wss.live-rates.com` |
| Americas | `us.live-rates.com` | `us-wss.live-rates.com` |
| Asia | `as.live-rates.com` | `as-wss.live-rates.com` |

The apex `live-rates.com` is fronted by a geo load balancer that routes each request to the nearest healthy zone. Pin a zone directly (e.g. `eu.live-rates.com`) for the lowest latency — at the cost of losing automatic fail-over if that box is down.

---

## Client examples

Ready-to-run clients live under [`examples/`](./examples). Each folder is a single file plus a minimal dependency manifest.

### REST

| Language | File |
|---|---|
| curl (bash) | [`examples/rest/curl.sh`](./examples/rest/curl.sh) |
| Node.js | [`examples/rest/node.js`](./examples/rest/node.js) |
| Python | [`examples/rest/python.py`](./examples/rest/python.py) |
| Ruby | [`examples/rest/ruby.rb`](./examples/rest/ruby.rb) |
| Go | [`examples/rest/go/main.go`](./examples/rest/go/main.go) |
| PHP | [`examples/rest/php.php`](./examples/rest/php.php) |

### Streaming

| Language | Folder | Library |
|---|---|---|
| Node.js | [`examples/streaming/node`](./examples/streaming/node) | `socket.io-client@4` |
| TypeScript | [`examples/streaming/typescript`](./examples/streaming/typescript) | `socket.io-client@4` + types |
| Python | [`examples/streaming/python`](./examples/streaming/python) | `python-socketio[client]>=5` |
| Go | [`examples/streaming/go`](./examples/streaming/go) | `github.com/maldikhan/go.socket.io` |
| Rust | [`examples/streaming/rust`](./examples/streaming/rust) | `rust_socketio@0.6` |
| Java | [`examples/streaming/java`](./examples/streaming/java) | `io.socket:socket.io-client:2.1.1` |
| Kotlin | [`examples/streaming/kotlin`](./examples/streaming/kotlin) | `io.socket:socket.io-client:2.1.1` |
| Swift / iOS | [`examples/streaming/swift`](./examples/streaming/swift) | `socket.io-client-swift@16` |
| Dart / Flutter | [`examples/streaming/dart`](./examples/streaming/dart) | `socket_io_client@3` |
| PHP | [`examples/streaming/php`](./examples/streaming/php) | `elephant.io/elephant.io:^5` |
| C# / .NET | [`examples/streaming/csharp`](./examples/streaming/csharp) | `SocketIOClient@3` |

> **Ruby streaming:** no shippable Ruby gem talks Socket.IO v4 cleanly today — `socket.io-client-simple` needs three separate monkey-patches to work on Ruby 3 + a Cloudflare-fronted origin, and the other maintained gems are asset-pipeline wrappers, not clients. Use the [REST example](./examples/rest/ruby.rb) or wrap [`faye-websocket`](https://github.com/faye/faye-websocket-ruby) around the Engine.IO v3 protocol yourself. PRs welcome when the ecosystem catches up.

Missing your language? [Open a PR](./CONTRIBUTING.md) — most clients are <40 lines.

---

## Cross-rates

For pairs without a direct quote, derive them from a common base. We publish quotes against liquid bases (USD, EUR, GBP…), so any two of those give you the cross:

```
MYR/CNY  =  USD/CNY  ÷  USD/MYR
         =  6.8421   ÷  4.14611
         =  1.65
```

---

## Versioning

The REST surface is **v1** and stable. Breaking changes will ship under a new path prefix (`/api/v2/…`) with at least 90 days of overlap. The streaming event names (`instruments`, `key`, `rates`) are part of the v1 contract.

---

## Support

- Subscriptions & billing → [live-rates.com/checkout](https://www.live-rates.com/checkout)
- Account / access issues → email the address on your receipt
- Bugs or doc gaps → [open an issue](https://github.com/Live-Rates/live-rates.com/issues) or a PR

---

<sub>© Live-Rates.com. Data licensed for use via an active subscription; redistribution requires written consent.</sub>
