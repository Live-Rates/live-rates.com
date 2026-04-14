# TypeScript streaming client

Same runtime as the Node example, with full types for the `rates` payload.

```bash
npm install
LIVERATES_KEY=trial npm start
```

The `Quote` interface matches the live streaming payload shape (numeric bid/ask/high/low/timestamp, `"n/a"` strings for open/close during active sessions) — drop it into your own project to get compile-time safety against the feed.
