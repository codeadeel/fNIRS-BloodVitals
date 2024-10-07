#!/usr/bin/env python3

# %%
# Importing Libraries
import os
import subprocess
from time import sleep
from flask import Flask, request, jsonify
import oledlib

# %%
# Connection Tools
oledisp = oledlib.oled()

def connect2Network(ssid, password):
    """
    This function is reponsible to connect with WiFi Network

    Arguments
    =========
    ssid : SSID to connect to 
    password : Password against SSID
    """
    hostName = os.environ.get('portalAddress', 'fnirs.codeadeel.com')
    print(f"[ NMCLI : Connection ] : {ssid} @ {password}")
    newConn = subprocess.run(f"nmcli device wifi connect \"{ssid}\" password \"{password}\"", shell=True, text=True, capture_output=True)
    if newConn.returncode==0:
        print(f"[ NMCLI : Connection ] : Connected with {ssid}")
        conn = subprocess.run(f"ping {hostName} -c 1", shell=True, text=True, capture_output=True)
        if conn.returncode==0:
            print(f"[ PING @ {hostName} ] : {conn.stdout}")
            oledisp.displayImage("/root/logoBitmap.png")
            sleep(7)
            oledisp.upstreamCheck()
            return f"[ PING @ {hostName} ] : {conn.stdout}"
        else:
            print(f"[ PING @ {hostName} ] : {conn.stderr}")
            oledisp.credsError()
            return f"[ PING @ {hostName} ] : {conn.stderr}"
    else:
        print(f"[ NMCLI : Connection @ {ssid} ] : {newConn.stderr}")
        oledisp.fatalError()
        return f"[ NMCLI : Connection @ {ssid} ] : {newConn.stderr}"

def handleNetworkConnection():
    """
    This function is used to check for network, else create hotspot
    """
    hostName = os.environ.get('portalAddress', 'fnirs.codeadeel.com') 
    conn = subprocess.run(f"ping {hostName} -c 1", shell=True, text=True, capture_output=True)
    if conn.returncode==0:
        print(f"[ PING @ {hostName} ] : {conn.stdout}")
        toggle = True
        while True:
            if toggle:
                toggle = False
                oledisp.displayImage("/root/logoBitmap.png")
            else:
                toggle = True
                oledisp.upstreamCheck()
            sleep(10)
    else:
        print(f"[ PING @ {hostName} ] : {conn.stderr}")
        print(f"[ NMCLI ] : Creating Local Hotspot")
        localWANName = os.environ.get("hotspotName", "fnirsEdge @ AEELab")
        localWANPassword = os.environ.get("hostpotPassword", "fnirsEdge123")
        localWANNetwork = os.environ.get("wanName", "fnirsHotspot")
        localWAN = subprocess.run(f"nmcli device wifi hotspot ifname wlan0 con-name {localWANNetwork} ssid \"{localWANName}\" password {localWANPassword}", shell=True, text=True, capture_output=True)
        if localWAN.returncode==0:
            localWANSetup = subprocess.run(f"nmcli connection modify {localWANNetwork} ipv4.addresses 10.10.0.1/24 ; nmcli connection up {localWANNetwork}", shell=True, text=True, capture_output=True)
            if localWANSetup.returncode==0:
                print(f"[ NMCLI @ Interface ] : {localWANNetwork}")
                print(f"[ NMCLI @ SSID ] : {localWANName}")
                print(f"[ NMCLI @ Password ] : {localWANPassword}")
                print(f"[ NMCLI @ Gateway ] : 10.10.0.1/24")
                print(f"[ NMCLI @ Captive Portal ] : 10.10.0.1")
            else:
                print(f"[ NMCLI : Modification ] : {localWANSetup.stderr}")
                oledisp.gatewayAssignmentError()
        else:
            print(f"[ NMCLI : Hotspot ] : {localWAN.stderr}")
            oledisp.fatalError()
        oledisp.showHotspot(localWANName, localWANPassword, "10 . 10 . 0 . 1 / 24")


# App Module
app = Flask(__name__)

@app.get('/api/network/connect')
def conn2Net():
    res = connect2Network(request.args.get('ssid'), request.args.get('password'))
    return jsonify(res), 200

# %%
# Execution
if __name__=='__main__':
    handleNetworkConnection()
    app.run(host = '0.0.0.0', port=int(os.environ.get('inferencePort', '5003')))
