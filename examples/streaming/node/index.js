// Live-Rates Streaming API — Node.js example.
//
//   npm install
//   node index.js
//
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

import { io } from "socket.io-client";

const KEY = process.env.LIVERATES_KEY ?? "trial";   // "trial" = 2-min free feed
const INSTRUMENTS = ["EURUSD", "GBPUSD", "BTCUSD"]; // [] or null = every pair

const socket = io("https://wss.live-rates.com", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  if (INSTRUMENTS?.length) socket.emit("instruments", INSTRUMENTS);
  socket.emit("key", KEY);
});

socket.on("rates", (raw) => {
  let msg;
  try { msg = JSON.parse(raw); } catch { msg = raw; }
  console.log(msg);
});

socket.on("disconnect", (reason) => console.log("disconnected:", reason));
