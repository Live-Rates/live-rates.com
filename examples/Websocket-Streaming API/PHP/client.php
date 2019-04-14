<?php


use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

require __DIR__ . '/vendor/autoload.php';



$client = new Client(new Version2X('https://wss.live-rates.com/'));

$client->initialize();
$client->emit('key', ['key' => 'trial']);

while (true) {
    $r = $client->read();

    $array = json_decode(getBetween($r,"[","]"));
    $obj = json_decode($array[1]);

    if (is_null($obj->currency)) {
        print_r($array[1]);
        print("\n");
    } else {

        echo("Instrument: {$obj->currency} | Ask: {$obj->ask} | Bid: {$obj->bid}");
        print("\n");
    }
}

$client->close();



function getBetween($string, $start = "", $end = ""){
    if (strpos($string, $start)) { // required if $start not exist in $string
        $startCharCount = strpos($string, $start) + strlen($start)-1;
        $firstSubStr = substr($string, $startCharCount, strlen($string));
        $endCharCount = strpos($firstSubStr, $end)+1;
        if ($endCharCount == 0) {
            $endCharCount = strlen($firstSubStr);
        }
        return substr($firstSubStr, 0, $endCharCount);
    } else {
        return '';
    }
}
