# Go streaming client

Uses [`maldikhan/go.socket.io`](https://github.com/maldikhan/go.socket.io), a Socket.IO v5-protocol Go client with zero third-party runtime dependencies (beyond `golang.org/x/net`). Works against the Live-Rates v4 server and the legacy v2/v3 fleet.

```bash
go mod tidy
LIVERATES_KEY=trial go run main.go
```

A tiny `silent{}` logger is wired in to suppress the library's verbose debug output. Remove it if you want to see the full Engine.IO handshake trace.
