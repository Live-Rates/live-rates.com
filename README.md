# Live-Rates.com

[**Live-Rates.com**](https://www.live-rates.com/) is a real-time JSON / XML Webservice & Rest API for forex, commodities and indexes. There is also a [Streaming API](#streaming-api) available for subscribers, starting in 2019.

The rates are updated **every second**.

# Usage

## Web-Service

Get the latest foreign exchange reference rates in JSON format.

```http
GET /rates
Host: live-rates.com
```

Get the latest foreign exchange reference rates in XML format.

```http
GET /rates?rate_format=xml
Host: live-rates.com
```

---

## Rest API 
(requires authentication)

Get the available currency pairs, commodities & indexes and also when they were last updated

```http
GET /api/rates?key=YOUR_KEY
Host: live-rates.com
```

Get the latest foreign exchange reference rates for the requested params, in JSON format.

```http
GET /api/price?rate=EUR_USD,EUR_GBP&key=YOUR_KEY
Host: live-rates.com
```

---

## Streaming API
(requires authentication)

With streaming API, it's no longer necessary to request for fresh data every second. 
When updated data is retrieved by the main server, it's automatically pushed to client via Web-socket technology (socket.io).

The central DNS server (wss.live-rates.com) connects you to the preferred datacenter based on your location and server availability. The available local servers are:

| Location | Socket Address | (*) Socket V3 Address
| --- | --- | --- |
| Router Server | wss.live-rates.com | wss3.live-rates.com |
| Europe | eu-wss.live-rates.com | eu-wss3.live-rates.com |
| US | us-wss.live-rates.com | us-wss3.live-rates.com |
| Asia | as-wss.live-rates.com | as-wss3.live-rates.com |


(*) Required for new client version of socketio (3.xx)

Check the Web-socket API examples, to understand how you can integrate and use it: 

* [Node.js / Javascript Example](https://github.com/Live-Rates/live-rates.com/tree/master/examples/Websocket-Streaming%20API/Node)
* [Java Example](https://github.com/Live-Rates/live-rates.com/blob/master/examples/Websocket-Streaming%20API/Java/client.java)
* [Python Example](https://github.com/Live-Rates/live-rates.com/blob/master/examples/Websocket-Streaming%20API/Python/streaming_client.py)
* [PHP Example](https://github.com/Live-Rates/live-rates.com/tree/master/examples/Websocket-Streaming%20API/PHP)
* [Microsoft / C# Example](https://github.com/Live-Rates/live-rates.com/tree/master/examples/Websocket-Streaming%20API/C%23)


![streaming_api](https://thumbs.gfycat.com/RecklessBountifulAtlanticbluetang-size_restricted.gif)


---


### Output Response

All APIs - Web-Service / Rest API / Streaming API - output data with the same structure. All fields are sent in string format:

```javascript
{
	Currency: "EUR/USD"        //Description of the Instrument 
	Rate: "1.13625"            //Same as BID (Deprecated)
	Bid: "1.13625"             //Bid Value of the Currency / Instrument
	Ask: "1.13638"             //Ask Value of the Currency / Instrument
	High: "1.14081"            //24H High of the Currency / Instrument
	Low: "1.13527"             //24H Low of the Currency / Instrument
	Open: "1.13725"            //Opening Value of the Daily Session / Previous Day if Market is Active
	Close: "1.13625"           //Closing Value of the Daily Session / Previous Day if Market is Active
	Timestamp: "1551477238763" //Timestamp of the Last Update
}
...
```


---------


# Historical Data
(requires authentication)

Live-Rates Provides Historical Data for a Limited number of Instruments (+-170). At the moment only Forex Currencies, Metals and Crypto are Available. All Endpoints Require Authentication.

## List Available Instruments

This will Output all Available Instruments

```http
GET /historical/list?key=YOUR_KEY
Host: live-rates.com
```

## Get Instrument Price on a Specific Previous Day

This Endpoint will provide the closing Price for the required day (23:59:59 UTC Time).

You can provide the Optional parameter *symbols* if you only need specific Pairs.

```http
GET /historical?base=EUR&date=YYYY-MM-DD&symbols=USD&key=YOUR_KEY
Host: live-rates.com
```


## Get Series Data for a Base Instrument

This Endpoint will provide the rates for a given past time period that cannot be longer than **30 Days**.

You can provide the Optional parameter *symbols* if you only need specific Pairs.

```http
GET /historical/series?base=EUR&start=YYYY-MM-DD&end=YYYY-MM-DD&symbols=USD&key=YOUR_KEY
Host: live-rates.com
```

----

# Cross-Rates

For obvious reasons, Live-Rates don't provide all the thousands of possible cross-rate's combinations directly. All our available rates come directly from providers with real liquidity. If you need to get/calculate a rate not available directly, you can convert it, changing the base currency.

Example:
MYR/CNY, MYR/GBP or any other cross-rates with base currency MYR are not provided. However that doesn't mean you can't get them. In this case/example, you can directly use the USD/MYR, and then the USD/XXX you want.

```javascript
{
	"currency":"USD/MYR","rate":"4.14611",
	"currency":"USD/CNY","rate":"6.8421"
}
// 6.84/4.15 = 1.65 MYR/CNY
```

# Multi-Region
Live-Rates has currently multiple servers in 3 Datacenters: 
* Europe: (eu.live-rates.com)
* America: (us.live-rates.com)
* Asia (**new**): (as.live-rates.com)

Requests made to live-rates.com are forwarded and resolved by our central DNS server in Europe.

If you bypass the DNS server and connect directly to a specific datacenter, the connection would be faster however in case of an issue with the server, you will receive a 502 or 521 instead of a Success Response from the alternative server.



----


# Authentication

We allow up to 3 hits/hour/ip for un-authententicated requests, if you need to make API requests or get live rates updated every second you'll need to [subscribe a licence](https://www.live-rates.com/checkout) and include on your requests the following param:


```http
GET /rates?key=Your key
Host: live-rates.com
```

# Limitation / Throttling

We restrict access to abusers. If your licence is accessing more than 1x per second on a 10-min average, it will be temporarily locked for 10 minutes. You will receive ```503 Service Unavailable``` during that period.
