/*        
Please install socket.io-client V2.3.1:
npm i socket.io-client@2.3.1
Version 3 introduduced breaking changes that are incompatible with our server running V2
*/

const io = require('socket.io-client');
const socket = io('https://wss.live-rates.com/')

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
