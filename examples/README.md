# Client examples

Every example here is one file + a tiny dependency manifest. The streaming examples all follow the same flow:

1. connect to `https://wss.live-rates.com`
2. *(optional)* emit `instruments` with the pairs you want
3. emit `key` (use `"trial"` for a free 2-minute feed)
4. listen on `rates`

## REST

| Language | Path |
|---|---|
| curl (bash) | [`rest/curl.sh`](./rest/curl.sh) |
| Node.js 18+ | [`rest/node.js`](./rest/node.js) |
| Python 3 | [`rest/python.py`](./rest/python.py) |
| Ruby | [`rest/ruby.rb`](./rest/ruby.rb) |
| Go | [`rest/go/`](./rest/go) |
| PHP 8 | [`rest/php.php`](./rest/php.php) |

## Streaming (socket.io v4)

| Language | Path |
|---|---|
| Node.js | [`streaming/node/`](./streaming/node) |
| TypeScript | [`streaming/typescript/`](./streaming/typescript) |
| Python | [`streaming/python/`](./streaming/python) |
| Go | [`streaming/go/`](./streaming/go) |
| Rust | [`streaming/rust/`](./streaming/rust) |
| Java | [`streaming/java/`](./streaming/java) |
| Kotlin | [`streaming/kotlin/`](./streaming/kotlin) |
| Swift / iOS | [`streaming/swift/`](./streaming/swift) |
| Dart / Flutter | [`streaming/dart/`](./streaming/dart) |
| PHP | [`streaming/php/`](./streaming/php) |
| C# / .NET 8 | [`streaming/csharp/`](./streaming/csharp) |

> Ruby doesn't have a shippable Socket.IO v4 client today — use the [REST example](./rest/ruby.rb).

Missing your language? PRs welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
