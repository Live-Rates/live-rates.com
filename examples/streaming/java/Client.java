// Live-Rates Streaming API — Java example.
//
// Gradle:  implementation 'io.socket:socket.io-client:2.1.1'
// Maven:   <dependency>
//            <groupId>io.socket</groupId>
//            <artifactId>socket.io-client</artifactId>
//            <version>2.1.1</version>
//          </dependency>
//
// Run:  java Client
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

import io.socket.client.IO;
import io.socket.client.Socket;
import org.json.JSONArray;

import java.net.URI;

public class Client {
    public static void main(String[] args) throws Exception {
        String key = System.getenv().getOrDefault("LIVERATES_KEY", "trial");
        JSONArray instruments = new JSONArray()
                .put("EURUSD").put("GBPUSD").put("BTCUSD");

        Socket socket = IO.socket(URI.create("https://wss.live-rates.com"));

        socket.on(Socket.EVENT_CONNECT, a -> {
            socket.emit("instruments", instruments);
            socket.emit("key", key);
        });

        socket.on("rates", a -> {
            for (Object msg : a) System.out.println(msg);
        });

        socket.on(Socket.EVENT_DISCONNECT, a -> System.out.println("disconnected"));

        socket.connect();
        Thread.currentThread().join();
    }
}
