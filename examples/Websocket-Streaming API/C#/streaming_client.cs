// https://github.com/doghappy/socket.io-client-csharp
 
var client = new SocketIO("https://wss.live-rates.com");
 
client.OnConnected += async (sender, e) =>
{
 
    // USE THIS LIST TO FILTER AND RECEIVE ONLY INSTRUMENTS YOU NEED. LEAVE EMPTY TO RECEIVE ALL
    // If you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the line below.
    await client.EmitAsync("instruments", "EURUSD,USDJPY,BTCUSD,ETH");
 
    // Use the 'trial' as key to establish a 2-minute streaming connection with real-time data.
	   // After the 2-minute test, the server will drop the connection and block the IP for an Hour.
    await client.EmitAsync("key", "trial");
 
};
 
client.On("rates", response =>
{
    string text = response.GetValue<string>();
});
await client.ConnectAsync();
