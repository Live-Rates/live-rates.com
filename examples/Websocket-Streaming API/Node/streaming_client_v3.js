const io = require('socket.io-client');
const socket = io('https://wss3.live-rates.com/', {transports: ['websocket']})

//Use the 'trial' as key to establish a 2-minute streaming connection with real-time data.
//After the 2-minute test, the server will drop the connection and block the IP for an Hour.

var key = 'trial' 
//var key = 'XXXXXXX' //YOUR LIVE-RATES SUBSCRIPTION KEY


socket.on('connect', function() {
  
  // if you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the line below.
  var instruments = ['EURUSD', 'USDJPY', 'BTCUSD', 'ETH']
  socket.emit('instruments', instruments);
  
  socket.emit('key', key); 
});

socket.on('rates', function(msg) {

  //Do what you want with the Incoming Rates... Enjoy!
  try {
    let obj = JSON.parse(msg);
    console.log(obj)

  } catch (e) {
    console.log(msg)
  }

});
