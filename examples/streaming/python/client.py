"""Live-Rates Streaming API — Python example.

    pip install -r requirements.txt
    python client.py

Docs: https://github.com/Live-Rates/live-rates.com#streaming-api
"""
import json
import os
import socketio

KEY = os.environ.get("LIVERATES_KEY", "trial")  # "trial" = 2-min free feed
INSTRUMENTS = ["EURUSD", "GBPUSD", "BTCUSD"]    # [] = every pair

sio = socketio.Client()


@sio.event
def connect():
    if INSTRUMENTS:
        sio.emit("instruments", INSTRUMENTS)
    sio.emit("key", KEY)


@sio.event
def rates(raw):
    try:
        print(json.loads(raw))
    except (TypeError, ValueError):
        print(raw)


@sio.event
def disconnect():
    print("disconnected")


sio.connect("https://wss.live-rates.com", transports=["websocket"])
sio.wait()
