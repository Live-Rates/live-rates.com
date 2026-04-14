# Rust streaming client

Uses [`rust_socketio`](https://crates.io/crates/rust_socketio), a maintained Socket.IO v4 client for Rust.

```bash
LIVERATES_KEY=trial cargo run
```

The `rates` event carries a JSON-stringified payload — `Payload::String(s)` is the usual arm; `serde_json::from_str` on `s` gets you a typed quote.
