#!/usr/bin/env python3

# This file is responsible for update daemon

# %%
# Importing Libraries
import os
import subprocess
from time import sleep
import requests
import oledlib

# %%
# Check version difference
def checkDownloadDiff(existFile, ftpLink):
    """
    This function is used to check for the hash difference to take update decision

    Arguments
    =========
    existFile : Absolute address for exisiting version file
    ftpLink : Web address file to check for new version
    """
    with open(existFile, "r") as file1:
        edat = file1.readlines()[0].replace("\n", "")
        print(f"[ Existing Hash ] : {edat}")
    resp = requests.get(ftpLink).text.replace("\n", "")
    print(f"[ New Hash ] : {resp}")
    if edat==resp:
        return False
    else:
        return True

def updateMechanism(firstTime=False):
    """
    This function provides update mechanism for the update daemon
    
    Arguments
    =========
    firstTime : Check if the mechanism is being run first time
    """
    brkEror = ["X    BRICKED    X", "code.adeel@gmail.com"]
    oledisp = oledlib.oled()
    if firstTime:
        oledisp.displayImage("/root/logoBitmap.png")
        sleep(7)
    oledisp.checkingUpdates()
    print("[ Update Daemon ] : Checking for Updates")
    if checkDownloadDiff("/root/version", "https://www.ftp.codeadeel.com/fnirsEdgeDevice/version"):
        oledisp.updating()
        print("[ Update Daemon ] : Downloading Updates")
        updte = subprocess.run(f"wget -O /root/install.sh https://www.ftp.codeadeel.com/fnirsEdgeDevice/install.sh", shell=True, text=True, capture_output=True)
        if updte.returncode==0:
            print("[ Update Daemon ] : Installing Updates")
            excer = subprocess.run(f"/bin/bash /root/install.sh", shell=True, text=True, capture_output=True)
            if excer.returncode==0:
                clnup = subprocess.run(f"rm /root/install.sh", shell=True, text=True, capture_output=True)
                if clnup.returncode==0:
                    print("[ Update Daemon ] : Cleanup Process Completed")
                else:
                    print("[ Update Daemon ] : Cleanup Process Failed")
            else:
                print("[ Update Daemon ] : Device Bricked")
                oledisp.throwError(brkEror[0], brkEror[1])
                exit()
        else:
            oledisp.throwError("UPD-1", "Update Failed")
            print("[ Update Daemon ] : Update Failed")
    print("[ Update Daemon ] : Checking System Health")
    nginxService = subprocess.run("systemctl is-active nginx.service", shell=True, text=True, capture_output=True)
    fnirsService = subprocess.run("systemctl is-active fnirsNetwork.service", shell=True, text=True, capture_output=True)
    if ((nginxService.stdout.replace("\"", "").replace("\n", "")=="active") and (fnirsService.stdout.replace("\"", "").replace("\n", "")=="active")):
        portalAddress = requests.get("http://0.0.0.0:5003/api/network/portaladdress").text.replace("\"", "").replace("\n", "")
        serverCheck = requests.get(f"http://0.0.0.0:5003/api/network/servercheck?server={portalAddress}").text.replace("\"", "").replace("\n", "")
        if serverCheck=="true":
            oledisp.upstreamCheck(portalAddress)
        else:
            print("[ Update Daemon ] : Requesting Hotspot")
            hpot = requests.get(f"http://0.0.0.0:5003/api/network/createhotspot?ssid=fnirsEdge @ AEELab&password=fnirsEdge123")
    else:
        print("[ Update Daemon ] : Device Bricked")
        oledisp.throwError(brkEror[0], brkEror[1])
        exit()

# %%
# Execution
if __name__=="__main__":
    updateMechanism(True)
    while True:
        sleep(21600)
        updateMechanism()
