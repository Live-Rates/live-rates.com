# Dart / Flutter streaming client

Uses [`socket_io_client`](https://pub.dev/packages/socket_io_client) — the most-used Socket.IO client in the Dart ecosystem, v4-compatible.

```bash
dart pub get
LIVERATES_KEY=trial dart run
```

Flutter integration: same `pubspec.yaml` dependency, same code — call from inside your `State` / `StreamBuilder`, expose the `rates` stream up your widget tree.
