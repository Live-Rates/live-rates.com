// Install Socket.io Java Client
// https://socketio.github.io/socket.io-client-java/installation.html

Socket socket = IO.socket("https://wss3.live-rates.com");

String key = 'trial' 
//String key = 'XXXXXXX' // YOUR LIVE-RATES SUBSCRIPTION KEY
  
socket.on("connect", new Emitter.Listener() {
    @Override
    public void call(Object... args) {
        // if you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the line below.
        String[] instruments = ['EURUSD', 'USDJPY', 'BTCUSD', 'ETH']
        socket.emit('instruments', instruments);
      
        socket.emit("key", key);
    }
});


socket.on("rates", new Emitter.Listener() {
  @Override
  public void call(Object... args) {
    //Do what you want with the Incoming Rates... Enjoy!
    try {
      System.out.println(args);
    } catch (e) {
      System.out.println(e);
    }
  }
});
