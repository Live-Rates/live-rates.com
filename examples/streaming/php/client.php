<?php
// Live-Rates Streaming API — PHP example.
//
//   composer install
//   php client.php
//
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

require __DIR__ . '/vendor/autoload.php';

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version4X;

$key  = getenv('LIVERATES_KEY') ?: 'trial';   // "trial" = 2-min free feed
$pairs = ['EURUSD', 'GBPUSD', 'BTCUSD'];

$client = new Client(new Version4X('https://wss.live-rates.com'));
$client->connect();

$client->emit('instruments', $pairs);
$client->emit('key', $key);

while (true) {
    $packet = $client->wait('rates');
    if ($packet === null) continue;
    print_r($packet->data);
    echo PHP_EOL;
}
