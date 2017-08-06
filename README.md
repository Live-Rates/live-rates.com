# Live-Rates.com

[**Live-Rates.com**](https://www.live-rates.com/) is a real-time JSON / XML Webservice & API for forex, commodities and indexes.

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

## API (requires authentication)

Get the available currency pairs, commodities & indexes and also when they were last updated

```http
GET /api/rates
Host: live-rates.com
```

Get the latest foreign exchange reference rates for the requested params, in JSON format.

```http
GET /api/price?rate=EUR_USD,EUR_GBP
Host: live-rates.com
```

## Authentication

We allow up to 3 hits/hour/ip for un-authententicated requests, if you need to make API requests or get live rates updated every second you'll need to [subscribe a licence](https://www.live-rates.com/#pricing) and include on your requests the following param:


```http
GET /rates?key=Your key
Host: live-rates.com
```

