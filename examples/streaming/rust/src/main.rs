// Live-Rates Streaming API — Rust example.
//
//   cargo run
//
// Uses the `rust_socketio` crate (Socket.IO v4 client, maintained).
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

use rust_socketio::{ClientBuilder, Payload};
use std::env;
use std::sync::mpsc::channel;

fn main() {
    let key = env::var("LIVERATES_KEY").unwrap_or_else(|_| "trial".to_string());
    let pairs = vec!["EURUSD", "GBPUSD", "BTCUSD"];

    let _client = ClientBuilder::new("https://wss.live-rates.com")
        .on("connect", move |_, socket| {
            socket.emit("instruments", serde_json::json!(pairs)).ok();
            socket.emit("key", serde_json::json!(key)).ok();
        })
        .on("rates", |payload, _| match payload {
            Payload::Text(values) => println!("{:?}", values),
            Payload::Binary(bytes) => println!("{} bytes", bytes.len()),
            Payload::String(s) => println!("{}", s),
        })
        .on("disconnect", |_, _| println!("disconnected"))
        .connect()
        .expect("connection failed");

    // Block main thread forever (Ctrl-C to exit).
    let (_tx, rx) = channel::<()>();
    rx.recv().ok();
}
