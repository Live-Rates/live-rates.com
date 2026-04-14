// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "LiveRatesStreamingExample",
    platforms: [.macOS(.v12)],
    dependencies: [
        .package(url: "https://github.com/socketio/socket.io-client-swift", from: "16.1.1"),
    ],
    targets: [
        .executableTarget(
            name: "LiveRatesStreamingExample",
            dependencies: [
                .product(name: "SocketIO", package: "socket.io-client-swift"),
            ]
        ),
    ]
)
