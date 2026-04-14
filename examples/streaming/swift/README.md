# Swift streaming client

Uses the official [`Socket.IO-Client-Swift`](https://github.com/socketio/socket.io-client-swift), maintained by the socket.io team. Works on macOS, iOS, watchOS, tvOS, and visionOS.

```bash
LIVERATES_KEY=trial swift run
```

To drop this into an Xcode project, add the package dependency `https://github.com/socketio/socket.io-client-swift` (branch: default, version: 16.1.1 or later) and copy `Sources/LiveRatesStreamingExample/main.swift` into your target.
