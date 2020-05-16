#pip install "python-socketio[client]"

import socketio
import json

## USE THIS LIST TO FILTER AND RECEIVE ONLY INSTRUMENTS YOU NEED. LEAVE EMPTY TO RECEIVE ALL
instruments = ['EURUSD', 'USDJPY', 'BTCUSD', 'ETH']

sio = socketio.Client(ssl_verify=False)

@sio.event
def connect():
	sio.emit('key', 'trial')

	#if you want to subscribe only specific instruments, emit instruments. To receive all instruments, comment the line below.
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
