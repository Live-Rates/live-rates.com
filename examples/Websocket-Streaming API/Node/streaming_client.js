const io = require('socket.io-client');
const socket = io('https://wss.live-rates.com/')

//var key = 'XXXXXXX' //YOUR LIVE-RATES SUBSCRIPTION KEY

//Use the 'trial' as key to establish a 2-minute streaming connection with real-time data.
//After the 2-minute test, the server will drop the connection and block the IP for an Hour.
var key = 'trial' 


socket.on('connect', function() {
  socket.emit('key', key, (data) => {
    console.log(data); //RESPONSE FROM SERVER
  });
});

socket.on('rates', function(msg) {
  //Do what you want with the Incoming Rates... Enjoy!
  console.log(msg)
});