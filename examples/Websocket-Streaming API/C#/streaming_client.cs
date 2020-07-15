// https://github.com/doghappy/socket.io-client-csharp
 
var client = new SocketIO("https://wss.live-rates.com");
 
client.OnConnected += async (sender, e) =>
{
    await client.EmitAsync("key", "trial");
};
 
client.On("rates", response =>
{
    string text = response.GetValue<string>();
});
await client.ConnectAsync();
