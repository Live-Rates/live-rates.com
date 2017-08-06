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

## API

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

## Authenticate

We allow up to 3 hits/hour/ip for un-authententicated requests, if you need to get live rates updated every second you will need to [subscribe a licence](https://www.live-rates.com/#pricing) and include on your requests the following param:


```http
GET /rates?key=Your key
Host: live-rates.com
```

