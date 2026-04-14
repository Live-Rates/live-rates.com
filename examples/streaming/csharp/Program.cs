// Live-Rates Streaming API — C# / .NET 8 example.
//
//   dotnet run
//
// Docs: https://github.com/Live-Rates/live-rates.com#streaming-api

using SocketIOClient;

var key   = Environment.GetEnvironmentVariable("LIVERATES_KEY") ?? "trial";
var pairs = new[] { "EURUSD", "GBPUSD", "BTCUSD" };

var client = new SocketIO("https://wss.live-rates.com", new SocketIOOptions
{
    Transport = SocketIOClient.Transport.TransportProtocol.WebSocket,
});

client.OnConnected += async (_, _) =>
{
    await client.EmitAsync("instruments", pairs);
    await client.EmitAsync("key", key);
};

client.On("rates", response =>
{
    Console.WriteLine(response.GetValue<string>());
});

client.OnDisconnected += (_, reason) => Console.WriteLine($"disconnected: {reason}");

await client.ConnectAsync();
await Task.Delay(Timeout.Infinite);
