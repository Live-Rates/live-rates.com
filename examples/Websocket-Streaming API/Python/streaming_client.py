#pip install socketio
#pip install "python-socketio[client]"

sio = socketio.Client(ssl_verify=False)

@sio.event
def connect():
    sio.emit('key', 'trial')

@sio.event
def rates(rates):
    print(rates)


@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('https://wss.live-rates.com/', transports=['websocket'])
sio.wait()
