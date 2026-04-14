# Live-Rates REST API — Ruby example.
# Run:  ruby ruby.rb
# Docs: https://github.com/Live-Rates/live-rates.com#rest-api

require "net/http"
require "json"
require "uri"

KEY  = ENV["LIVERATES_KEY"]
BASE = "https://www.live-rates.com"

def get(path)
  uri = URI("#{BASE}#{path}")
  JSON.parse(Net::HTTP.get(uri))
end

# Full quotes for every instrument. Keyless = 3/hour/IP; with key = unlimited.
all = get(KEY ? "/rates?key=#{KEY}" : "/rates")
abort all.first["error"] if all.first && all.first["error"]
puts "Loaded #{all.size} instruments"
all.first(3).each { |r| puts "#{r['currency'].ljust(10)} bid=#{r['bid']} ask=#{r['ask']}" }

# Specific pairs (key required).
if KEY
  quote = get("/api/price?key=#{KEY}&rate=EUR_USD,GBP_USD,BTC_USD")
  quote.each { |r| puts "#{r['currency'].ljust(10)} bid=#{r['bid']} ask=#{r['ask']}" }
else
  puts "\nSet LIVERATES_KEY to also fetch /api/price for specific pairs."
end
