// Live-Rates Streaming API — Swift example.
//
//   swift run
//
// Uses Socket.IO-Client-Swift (the official socket.io team client).
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

import Foundation
import SocketIO

let key = ProcessInfo.processInfo.environment["LIVERATES_KEY"] ?? "trial"
let pairs = ["EURUSD", "GBPUSD", "BTCUSD"]

let manager = SocketManager(
    socketURL: URL(string: "https://wss.live-rates.com")!,
    config: [.log(false), .compress]
)
let socket = manager.defaultSocket

socket.on(clientEvent: .connect) { _, _ in
    socket.emit("instruments", pairs)
    socket.emit("key", key)
}

socket.on("rates") { data, _ in
    guard let raw = data.first as? String,
          let body = raw.data(using: .utf8),
          let json = try? JSONSerialization.jsonObject(with: body) else {
        print(data)
        return
    }
    print(json)
}

socket.on(clientEvent: .disconnect) { _, _ in print("disconnected") }

socket.connect()
RunLoop.main.run()
