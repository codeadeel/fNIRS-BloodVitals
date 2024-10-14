#!/usr/bin/env python3

# This file is responsible for network manager API

# %%
# Importing Libraries
import os
import subprocess
import random
from time import sleep
import requests
from flask import Flask, request, jsonify
import threading
import oledlib

# %%
# App Module
app = Flask(__name__)
if os.path.exists('/root/portalAddress'):
    with open('/root/portalAddress', 'r') as file1:
        os.environ['portalAddress'] = file1.read().replace("\"", "")
        print(os.environ['portalAddress'])
else:
    os.environ['portalAddress'] = "fnirs.codeadeel.com"
infPort = int(os.environ.get("inferencePort", 5003))
oledisp = oledlib.oled()

@app.get('/api/device/id')
def getDeviceID():
    """
    This functinoal API is used to get the Device ID
    """
    if not os.path.exists('/root/deviceid'):
        currentDeviceID = ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', k = 15))
        with open('/root/deviceid', 'w') as file3:
            file3.write(currentDeviceID)
    else:
        with open('/root/deviceid', 'r') as file3:
            currentDeviceID = file3.read().replace("\"", "")
    jsonify(currentDeviceID), 200
            
@app.get('/api/network/portaladdress')
def checkPortalAddress():
    """
    This functional API is used to check current data transmitting portal address
    """
    return jsonify(os.environ.get('portalAddress')), 200

@app.get('/api/network/connect')
def conn2Net():
    """
    This functional API is used to connect with a WiFi Network

    Request Arguments
    =================
    ssid : SSID to connect to
    password : Password against SSID
    server : Server address to connect to
    """
    ssid = request.args.get('ssid')
    password = request.args.get('password')
    hostName = request.args.get('server')
    returnStatement = ""
    if hostName=="":
        os.environ['portalAddress'] = "fnirs.codeadeel.com"
    else:
        os.environ['portalAddress'] = hostName
    with open("/root/portalAddress", "w") as file2:
        file2.write(os.environ['portalAddress'].replace("\"", ""))
    print(f"[ NMCLI : Connection ] : {ssid} @ {password} >> {hostName}")
    newConn = subprocess.run(f"nmcli device wifi connect \"{ssid}\" password \"{password}\"", shell=True, text=True, capture_output=True)
    if newConn.returncode==0:
        print(f"[ NMCLI : Connection ] : Connected with {ssid}")
        conn = subprocess.run(f"ping {hostName} -c 1", shell=True, text=True, capture_output=True)
        if conn.returncode==0:
            print(f"[ PING @ {hostName} ] : {conn.stdout}")
            oledisp.upstreamCheck(hostName)
            returnStatement = f"[ PING @ {hostName} ] : {conn.stdout}"
        else:
            print(f"[ PING @ {hostName} ] : {conn.stderr}")
            oledisp.pingError()
            returnStatement = f"[ PING @ {hostName} ] : {conn.stderr}"
    else:
        print(f"[ NMCLI : Connection @ {ssid} ] : {newConn.stderr}")
        oledisp.credsError()
        hotspotReq = requests.get(f"http://0.0.0.0:{infPort}/api/network/createhotspot?ssid=fnirsEdge @ AEELab&password=fnirsEdge123")
        returnStatement = f"[ NMCLI : Connection @ {ssid} ] : {newConn.stderr}"
    return jsonify(returnStatement), 200

@app.get('/api/network/servercheck')
def checkServerAvailable():
    """
    This functional API is used to check server availability

    Request Arguments
    =================
    server : Server address to ping to
    """
    serverAddr = request.args.get('server')
    conn = subprocess.run(f"ping {serverAddr} -c 1", shell=True, text=True, capture_output=True)
    if conn.returncode==0:
        print(f"[ PING @ {serverAddr} ] : {conn.stdout}")
        return jsonify(True), 200
    else:
        print(f"[ PING @ {serverAddr} ] : {conn.stderr}")
        return jsonify(False), 200

@app.get('/api/network/createhotspot')
def createHotspot():
    """
    This functional API is used to create hotspot

    Request Arguments
    =================
    ssid : SSID to create for hotspot
    password : Password for the hotspot
    """
    print(f"[ NMCLI ] : Creating Local Hotspot")
    localWANName = request.args.get('ssid')
    localWANPassword = request.args.get('password')
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
    return jsonify(f"{localWANName}, {localWANPassword}"), 200

# %%
# Execution
if __name__=='__main__':
    app.run(host = '0.0.0.0', port=infPort)
    