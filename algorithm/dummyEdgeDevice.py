#!/usr/bin/env python3

# This file mimics edge device as sending data over socket.

# %%
# Importing Libraries
import random
import time
import socketio

if __name__=="__main__":
    # Initializing Socker Connection
    sio = socketio.SimpleClient()
    sio.connect('https://fnirs.codeadeel.com')
    deviceID = random.random()

    # Sending Dummy Data
    for i in range(10000):
        sio.emit('serverRAW', {
                "deviceID": deviceID,
                "values": {
                    '870nmch1': random.random(),
                    '870nmch2': random.random(),
                    '870nmch3': random.random(),
                    '870nmch4': random.random(),
                    '940nmch1': random.random(),
                    '940nmch2': random.random(),
                    '940nmch3': random.random(),
                    '940nmch4': random.random(),
                    '1200nmch1': random.random(),
                    '1200nmch2': random.random(),
                    '1200nmch3': random.random(),
                    '1200nmch4': random.random(),
                    '1550nmch1': random.random(),
                    '1550nmch2': random.random(),
                    '1550nmch3': random.random(),
                    '1550nmch4': random.random()
                },
                "voltages": {
                    '870nmch1': random.random(),
                    '870nmch2': random.random(),
                    '870nmch3': random.random(),
                    '870nmch4': random.random(),
                    '940nmch1': random.random(),
                    '940nmch2': random.random(),
                    '940nmch3': random.random(),
                    '940nmch4': random.random(),
                    '1200nmch1': random.random(),
                    '1200nmch2': random.random(),
                    '1200nmch3': random.random(),
                    '1200nmch4': random.random(),
                    '1550nmch1': random.random(),
                    '1550nmch2': random.random(),
                    '1550nmch3': random.random(),
                    '1550nmch4': random.random()
                },
            })

        time.sleep(0.01)

    sio.disconnect()