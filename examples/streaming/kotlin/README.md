# Kotlin streaming client

Uses [`io.socket:socket.io-client:2.1.1`](https://github.com/socketio/socket.io-client-java) (same JVM library as the Java example), called from idiomatic Kotlin.

```bash
gradle run
# or, if you have the wrapper:
./gradlew run
```

The `args` passed to the `rates` handler is an `Array<Any>` where `args[0]` is the JSON string payload — parse it with `JSONObject(args[0] as String)` or `kotlinx.serialization`.
