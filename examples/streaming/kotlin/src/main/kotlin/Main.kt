// Live-Rates Streaming API — Kotlin example.
//
//   gradle run   (or ./gradlew run if the wrapper is present)
//
// Uses io.socket:socket.io-client (same JVM client as the Java example),
// called idiomatically from Kotlin.
//
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONArray
import java.net.URI

fun main() {
    val key = System.getenv("LIVERATES_KEY") ?: "trial"
    val pairs = JSONArray(listOf("EURUSD", "GBPUSD", "BTCUSD"))

    val socket: Socket = IO.socket(URI.create("https://wss.live-rates.com"))

    socket.on(Socket.EVENT_CONNECT) {
        socket.emit("instruments", pairs)
        socket.emit("key", key)
    }

    socket.on("rates") { args -> args.forEach { println(it) } }

    socket.on(Socket.EVENT_DISCONNECT) { println("disconnected") }

    socket.connect()
    Thread.currentThread().join()
}
