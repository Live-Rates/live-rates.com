// Live-Rates Streaming API — Go example.
//
//   go mod tidy
//   LIVERATES_KEY=trial go run main.go
//
// Uses maldikhan/go.socket.io — a Socket.IO v5 client that works against
// Live-Rates' v4 server. Zero third-party deps beyond golang.org/x/net.
//
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	socketio "github.com/maldikhan/go.socket.io/socket.io/v5/client"
)

// silent implements socketio.Logger — discards all logs (the library is chatty).
type silent struct{}

func (silent) Debugf(string, ...any) {}
func (silent) Infof(string, ...any)  {}
func (silent) Warnf(string, ...any)  {}
func (silent) Errorf(string, ...any) {}

func main() {
	key := os.Getenv("LIVERATES_KEY")
	if key == "" {
		key = "trial"
	}

	client, err := socketio.NewClient(
		socketio.WithRawURL("https://wss.live-rates.com"),
		socketio.WithLogger(silent{}),
	)
	if err != nil {
		log.Fatal(err)
	}

	// The server always sends rates as a JSON-stringified single argument.
	client.On("rates", func(raw string) {
		var msg map[string]any
		if err := json.Unmarshal([]byte(raw), &msg); err != nil {
			fmt.Println(raw)
			return
		}
		fmt.Println(msg)
	})

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if err := client.Connect(ctx); err != nil {
		log.Fatal(err)
	}

	_ = client.Emit("instruments", []string{"EURUSD", "GBPUSD", "BTCUSD"})
	_ = client.Emit("key", key)

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
}
