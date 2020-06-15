#pip install "python-socketio[client]"

import socketio
import json



sio = socketio.Client(ssl_verify=False)

@sio.event
def connect():
	#Use the 'trial' as key to establish a 2-minute streaming connection with real-time data.
	#After the 2-minute test, the server will drop the connection and block the IP for an Hour.
	sio.emit('key', 'trial')
	
	## USE THIS LIST TO FILTER AND RECEIVE ONLY INSTRUMENTS YOU NEED. LEAVE EMPTY TO RECEIVE ALL
	#if you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the lines below.
	instruments = ['EURUSD', 'USDJPY', 'BTCUSD', 'ETH']
	sio.emit('instruments', instruments);

@sio.event
def rates(rates):
	try:
		instr = json.loads(rates)
		print(instr)

	except:
	  	print(rates)


@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('https://wss.live-rates.com/', transports=['websocket'])
sio.wait()
