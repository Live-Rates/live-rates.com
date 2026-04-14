<?php
// Live-Rates REST API — PHP example.
// Run:  php php.php
// Docs: https://github.com/Live-Rates/live-rates.com#rest-api

$key  = getenv('LIVERATES_KEY') ?: null;
$base = 'https://www.live-rates.com';

function get(string $url): array {
    $body = file_get_contents($url);
    if ($body === false) throw new RuntimeException("fetch failed: $url");
    return json_decode($body, true, flags: JSON_THROW_ON_ERROR);
}

// Full quotes for every instrument. Keyless = 3/hour/IP; with key = unlimited.
$all = get($key ? "$base/rates?key=$key" : "$base/rates");
if (!empty($all[0]['error'])) { exit("error: {$all[0]['error']}\n"); }
printf("Loaded %d instruments\n", count($all));
foreach (array_slice($all, 0, 3) as $r) {
    printf("%-10s bid=%s ask=%s\n", $r['currency'], $r['bid'], $r['ask']);
}

// Specific pairs (key required).
if ($key === null) {
    echo "\nSet LIVERATES_KEY to also fetch /api/price for specific pairs.\n";
    exit;
}
$quote = get("$base/api/price?key=$key&rate=EUR_USD,GBP_USD,BTC_USD");
foreach ($quote as $r) {
    printf("%-10s bid=%s ask=%s\n", $r['currency'], $r['bid'], $r['ask']);
}
