// Live-Rates REST API — Go example.
// Run:  go run main.go
// Docs: https://github.com/Live-Rates/live-rates.com#rest-api
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

const base = "https://www.live-rates.com"

type quote struct {
	Currency string `json:"currency"`
	Bid      string `json:"bid"`
	Ask      string `json:"ask"`
	Error    string `json:"error"`
}

func fetch(path string, v any) error {
	res, err := http.Get(base + path)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	return json.Unmarshal(body, v)
}

func main() {
	key := os.Getenv("LIVERATES_KEY")

	// Full quotes for every instrument. Keyless = 3/hour/IP; with key = unlimited.
	ratesPath := "/rates"
	if key != "" {
		ratesPath += "?key=" + key
	}
	var all []quote
	if err := fetch(ratesPath, &all); err != nil {
		panic(err)
	}
	if len(all) > 0 && all[0].Error != "" {
		fmt.Println("error:", all[0].Error)
		return
	}
	fmt.Printf("Loaded %d instruments\n", len(all))
	for _, r := range all[:min(3, len(all))] {
		fmt.Printf("%-10s bid=%s ask=%s\n", r.Currency, r.Bid, r.Ask)
	}

	// Specific pairs (key required).
	if key == "" {
		fmt.Println("\nSet LIVERATES_KEY to also fetch /api/price for specific pairs.")
		return
	}
	var q []quote
	if err := fetch("/api/price?key="+key+"&rate=EUR_USD,GBP_USD,BTC_USD", &q); err != nil {
		panic(err)
	}
	for _, r := range q {
		fmt.Printf("%-10s bid=%s ask=%s\n", r.Currency, r.Bid, r.Ask)
	}
}
