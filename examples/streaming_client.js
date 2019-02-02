const io = require('socket.io-client');
const socket = io('https://wss.live-rates.com/')

var key = 'XXXXXXX' //YOUR LIVE-RATES SUBSCRIPTION KEY

socket.on('connect', function(){
	socket.emit('key', key, (data) => {
	  console.log(data); //RESPONSE FROM SERVER
	});
});

socket.on('rates', function(msg){
	//Do what you want with the Incoming Rates... Enjoy!
	console.log(msg)
});
