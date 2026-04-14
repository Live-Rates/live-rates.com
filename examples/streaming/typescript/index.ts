// Live-Rates Streaming API — TypeScript example.
//
//   npm install
//   npx tsx index.ts
//
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

import { io, Socket } from "socket.io-client";

interface Quote {
  currency: string;
  bid: number;
  ask: number;
  high: number;
  low: number;
  open: number | "n/a";
  close: number | "n/a";
  timestamp: number;
}

type Message = Quote | { info: string } | { error: string };

const KEY: string = process.env.LIVERATES_KEY ?? "trial";
const INSTRUMENTS: string[] = ["EURUSD", "GBPUSD", "BTCUSD"];

const socket: Socket = io("https://wss.live-rates.com", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  if (INSTRUMENTS.length) socket.emit("instruments", INSTRUMENTS);
  socket.emit("key", KEY);
});

socket.on("rates", (raw: string) => {
  let msg: Message | string;
  try { msg = JSON.parse(raw) as Message; } catch { msg = raw; }
  console.log(msg);
});

socket.on("disconnect", (reason) => console.log("disconnected:", reason));
